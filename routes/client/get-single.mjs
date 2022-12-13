import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {getNewsQuery, getNewsQueryCount} from "../../modules/query/admin.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";
import {getSingleNewsQuery, updateViews} from "../../modules/query/user.mjs";

const getSingleClient = express.Router();

getSingleClient.get('/',async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            id
        } = req.query;
        await db.query(updateViews,[id])
            .then(res2=>{})
            .catch(err=>{})
        await db.query(getSingleNewsQuery,[id])
            .then(result=>{
                if(result.rows.length){
                    res.json(response(false,'success',result.rows[0]))
                } else {
                    badRequest(req,res);
                }

            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {getSingleClient};