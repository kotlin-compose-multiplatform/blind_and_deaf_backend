import express from "express";
import fs from "fs";
import { db } from "../../modules/database/connection.mjs";
import { deleteNews, getFilesById } from "../../modules/query/admin.mjs";
import { badRequest, response } from "../../modules/response.mjs";

const deleteNewsRouter = express.Router();

deleteNewsRouter.delete('/:id', async (req, res) => {
    if (typeof req.params === 'undefined' || req.params == null) {
        badRequest(req, res);
    } else {
        const {id}=req.params;
        db.query(getFilesById,[id])
            .then(async result=>{
                if(result.rows.length){
                    await result.rows.forEach(item=>{
                        fs.unlink(item.url,()=>{});
                    })
                    await db.query(deleteNews,[id])
                        .then(res2=>{
                            res.json(response(false,'success',id));
                        })
                        .catch(err=>{
                            console.log(err,'1');
                            badRequest(req,res);
                        })
                } else {
                    res.json(response(false,'success',id));
                }
            })
            .catch(err=>{
                console.log(err,'2');
                badRequest(req,res);
            })
    }
})

export {deleteNewsRouter};