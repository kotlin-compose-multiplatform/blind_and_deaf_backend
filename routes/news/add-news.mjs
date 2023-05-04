import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";
import fs from 'fs';
import multer from "multer";
import {db} from "../../modules/database/connection.mjs";
import {addFilesQuery, addNewsQuery} from "../../modules/query/admin.mjs";
import {Types} from "../../modules/constant/constant.mjs";
import format from "pg-format";
import * as path from "path";

const folderImage='public/uploads/images/news';
const folderVideo='public/uploads/videos/news';
const folderOther='public/uploads/others/news';

const checkFolderImage = (req, res, next) => {
    if (!fs.existsSync(folderImage)) {
        fs.mkdirSync(folderImage, { recursive: true });
    }
    next();
}
const checkFolderVideo = (req, res, next) => {
    if (!fs.existsSync(folderVideo)) {
        fs.mkdirSync(folderVideo, { recursive: true });
    }
    next();
}

const checkFolderOther = (req, res, next) => {
    if (!fs.existsSync(folderOther)) {
        fs.mkdirSync(folderOther, { recursive: true });
    }
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'images')
            cb(null, folderImage);
        else if (file.fieldname === 'video')
            cb(null, folderVideo);
        else
            cb(null,folderOther);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})



const uploader = multer({ storage: storage })

const addNewsRouter = express.Router();

const addNewsFunction=async(req,res)=>{
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const {
            title_tm,
            title_ru,
            title_en,
            content_tm,
            content_ru,
            content_en,
            is_project,
            is_product
        } = req.body;
        let video = '';
        let images = [];
        let others = [];
        if (typeof req.files !== 'undefined' && req.files.length) {
            req.files.forEach((file) => {
                if (file.fieldname === 'video') {
                    video = file.destination + "/" + file.filename;
                }
                if (file.fieldname === 'images') {
                    images.push(file.destination + "/" + file.filename);
                }
                if (file.fieldname === 'other') {
                    others.push(file.destination + "/" + file.filename);
                }
            })
        }

        db.query(addNewsQuery,[title_tm,title_ru,title_en,content_tm,content_ru,content_en,is_project,is_product])
            .then(result=>{
                if(result.rows.length){
                    let insertedId = result.rows[0].id;
                    let values = [
                        [video, insertedId, Types.video]
                    ];
                    if (images.length > 0) {
                        images.forEach((image, i) => {
                            values.push([image, insertedId, Types.image])
                        })
                    }
                    if (others.length > 0) {
                        others.forEach((other, i) => {
                            values.push([other, insertedId, Types.other])
                        })
                    }

                    db.query(format(addFilesQuery,values))
                        .then(filesResult=>{
                            if (filesResult.rows.length) {
                                res.json(response(false, "success", { product: result.rows, files: filesResult.rows }));
                                res.end();
                            } else {
                                res.json(response(false, "image is not available", { product: result.rows }));
                                res.end();
                            }
                        })
                        .catch(err=>{
                            res.json(response(false, err, { product: result.rows }));
                            res.end();
                        })
                }
            })
            .catch(err=>{
                badRequest(req,res);
            })


    }

}

addNewsRouter.post('/',verifyToken,checkFolderImage,checkFolderVideo,checkFolderOther,
    uploader.any(),
    addNewsFunction);

export {addNewsRouter};