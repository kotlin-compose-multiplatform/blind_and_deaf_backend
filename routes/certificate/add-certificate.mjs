import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import multer from "multer";
import fs from "fs";
import {verifyToken} from "../../modules/auth/token.mjs";
import {db} from "../../modules/database/connection.mjs";
import {addCertificateQuery} from "../../modules/query/admin.mjs";
import path from "path";

const addCertificate = express.Router();

const folder = 'public/uploads/certificate';
const folderImage = 'public/uploads/images/certificate';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname==='image'){
            cb(null, folderImage)
        } else {
            cb(null, folder)
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })
const uploader = upload.fields([{ name:'certificate',maxCount:1},{ name:'image',maxCount:1}]);

const checkFolder = (req, res, next) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    next();
}

const checkFolder2 = (req, res, next) => {
    if (!fs.existsSync(folderImage)) {
        fs.mkdirSync(folderImage, { recursive: true });
    }
    next();
}


addCertificate.post('/',verifyToken,checkFolder,checkFolder2,uploader, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const certificate = req.files.certificate[0].destination + "/" + req.files.certificate[0].filename;
        const image = req.files.image[0].destination + "/" + req.files.image[0].filename;
        const {
            name
        } = req.body;
        db.query(addCertificateQuery,[name,certificate,image])
            .then(result=>{
                if (result.rows.length) {
                    res.send(response(false, "success", result.rows[0]));
                    res.end();
                } else {
                    badRequest(req, res);
                }
            })
            .catch(err=>{
                console.log(err);
                badRequest(req,res);
            })
    }
})

export {addCertificate};