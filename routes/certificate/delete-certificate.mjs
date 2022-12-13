import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {deleteCertificateQuery, getSingleCertificateQuery} from "../../modules/query/admin.mjs";
import fs from "fs";

const deleteCertificate = express.Router();

deleteCertificate.delete('/:id', async (req, res) => {
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
                    badRequest(req,res);
                }
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {deleteCertificate};