import express from 'express';
import jwt from 'jsonwebtoken';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {generateUUID} from "../../modules/uuid/uuid.mjs";
import {secret_key} from "../../modules/constant/constant.mjs";
import {loginQuery} from "../../modules/query/admin.mjs";


const loginRouter = express.Router();
loginRouter.post('/', async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        db.query(loginQuery, [req.body.username, req.body.password])
            .then(result => {
                if (result.rows.length) {
                    const user = {
                        id: result.rows[0].id,
                        username: result.rows[0].username
                    };
                    jwt.sign({user}, secret_key, async (err, token) => {
                        if (err) badRequest(req, res);
                        result.rows[0].token = token;
                        res.json(response(false, "success", result.rows[0]));
                        res.end();

                    })
                } else {
                    badRequest(req, res);
                }
            })
            .catch(err => {
                console.log(err + "");
                badRequest(req, res);
            })
    }
});
export {loginRouter};