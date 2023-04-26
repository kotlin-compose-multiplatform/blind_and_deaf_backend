import express from "express";
import fs from "fs";
import { db } from "../../modules/database/connection.mjs";
import { deleteCertificateQuery, getSingleCertificateQuery } from "../../modules/query/admin.mjs";
import { badRequest, response } from "../../modules/response.mjs";

const deleteCertificate = express.Router();

deleteCertificate.patch('/:id', async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {id}=req.params;
        db.query(getSingleCertificateQuery,[id])
            .then(result=>{
                if(result.rows.length){
                    fs.unlink(result.rows[0].image,()=>{});
                    fs.unlink(result.rows[0].file_path,()=>{});
                    db.query(deleteCertificateQuery,[id])
                        .then(result=>{
                            res.json(response(false,'success','success'));
                            res.end();
                        })
                        .catch(err=>{
                            badRequest(req,res);
                        })
                } else {
                    console.log(result);
                    badRequest(req,res);
                }
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {deleteCertificate};