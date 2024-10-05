import express from 'express';
import {badRequest,response} from "../../modules/response.mjs";
import cyrillicToTranslit from "cyrillic-to-translit-js";
import {db} from "../../modules/database/connection.mjs";
import {searchQuery} from "../../modules/query/user.mjs";

const searchRouter = express.Router();

searchRouter.get('/', async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        let english = cyrillicToTranslit().transform(req.query.query);
        let russian = cyrillicToTranslit().reverse(req.query.query);
        await db.query(searchQuery, [req.query.query, russian, english])
            .then(result => {
                res.json(response(false, 'success', result.rows));
            })
            .catch(err => {
                res.send(err + "")
            })
    }
})

export {searchRouter};