import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";
import {updateInbox} from "../../modules/query/admin.mjs";

const getInbox = express.Router();

getInbox.get('/',verifyToken, async (req, res) => {
    db.query(`SELECT * FROM inbox ORDER BY created_at DESC`)
        .then(result=>{
            db.query(updateInbox)
                .then(result2=>{
                    res.json(response(false,'success',result.rows));
                    res.end();
                })
                .catch(err=>{
                    res.json(response(false,'success',result.rows));
                    res.end();
                })

        })
        .catch(err=>{
            badRequest(req,res);
        })
})

export {getInbox};