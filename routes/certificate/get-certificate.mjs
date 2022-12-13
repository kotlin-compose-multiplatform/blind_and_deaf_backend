import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {getCertificateQuery} from "../../modules/query/admin.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";

const getCertificate = express.Router();

getCertificate.get('/',verifyToken, async (req, res) => {
    db.query(getCertificateQuery)
        .then(result=>{
            res.json(response(false,'success',result.rows));
            res.end();
        })
        .catch(err=>{
            badRequest(req,res);
        })
})

export {getCertificate};