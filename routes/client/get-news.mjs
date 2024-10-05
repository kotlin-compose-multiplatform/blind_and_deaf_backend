import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {getNewsQuery, getNewsQueryCount} from "../../modules/query/admin.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";

const getnewsClient = express.Router();

getnewsClient.get('/',async (req, res) => {
    if (typeof req.query === 'undefined' || req.query == null) {
        badRequest(req, res);
    } else {
        const {
            limit,
            page,
            is_project,
            is_product
        } = req.query;
        db.query(getNewsQuery,[is_project,limit,page,is_product])
            .then(result=>{
                db.query(getNewsQueryCount,[is_project,is_product])
                    .then(res2=>{
                        let page_count = Math.ceil(res2.rows.length / limit);
                        if (page_count <= 0) {
                            page_count = 1;
                        }
                        res.json(response(false,'success',{data:result.rows,pageCount:page_count}))
                    })
                    .catch(err=>{
                        console.log(err);
                        badRequest(req,res);
                    })
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {getnewsClient};