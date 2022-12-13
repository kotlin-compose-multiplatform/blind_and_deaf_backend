import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";
import fs from 'fs';
import multer from "multer";
import {db} from "../../modules/database/connection.mjs";
import {addFilesQuery, addNewsQuery, deleteFiles, getFilesById, updateNewsQuery} from "../../modules/query/admin.mjs";
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

const getOldFiles=(req,res,next)=>{
    db.query(getFilesById,[req.body.id])
        .then(result=>{
            req.oldFiles=result.rows;
            next();
        })
        .catch(err=>{
            next();
        })
}



const uploader = multer({ storage: storage })

const editNewsRouter = express.Router();

const getFileByType=(files,type)=>{
    return files.filter(item=>item.mime_type==type).map(item=>item.id);
}

const editNewsFunction=async(req,res)=>{
    if (typeof req.body === 'undefined' || req.body == null) {
        console.log('1');
        badRequest(req, res);
    } else {
        const {
            title_tm,
            title_ru,
            title_en,
            content_tm,
            content_ru,
            content_en,
            id
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

        if(typeof video !== 'undefined' && video!==''){
            let ids=getFileByType(req.oldFiles,Types.video);
            try{
                req.oldFiles.forEach(item=>{
                    if(item.mime_type==Types.video){
                        fs.unlink(item.url,()=>{});
                    }
                })
            } catch (err){}
            await db.query(format(deleteFiles,ids,Types.video+""))
                .then(result=>{})
                .catch(err=>{});
        }
        if(typeof images !== 'undefined' && images.length>0){
            let ids=getFileByType(req.oldFiles,Types.image);
            try{
                req.oldFiles.forEach(item=>{
                    if(item.mime_type==Types.image){
                        fs.unlink(item.url,()=>{});
                    }
                })
            } catch (err){}
            await db.query(format(deleteFiles,ids,Types.image.toString()))
                .then(result=>{})
                .catch(err=>{});
        }
        if(typeof others !== 'undefined' && others.length>0){
            let ids=getFileByType(req.oldFiles,Types.other);
            try{
                req.oldFiles.forEach(item=>{
                    if(item.mime_type==Types.other){
                        fs.unlink(item.url,()=>{});
                    }
                })
            } catch (err){}
            await db.query(format(deleteFiles,ids,Types.other.toString()))
                .then(result=>{})
                .catch(err=>{});
        }

        db.query(updateNewsQuery,[title_tm,title_ru,title_en,content_tm,content_ru,content_en,id])
            .then(result=>{
                if(result.rows.length){
                    let insertedId = result.rows[0].id;
                    let values=[];
                    if(typeof video !== 'undefined' && video!=='') {
                        values = [
                            [video, insertedId, Types.video]
                        ];
                    }
                    if(typeof images !== 'undefined' && images.length>0) {
                        if (images.length > 0) {
                            images.forEach((image, i) => {
                                values.push([image, insertedId, Types.image])
                            })
                        }
                    }
                    if(typeof others !== 'undefined' && others.length>0) {
                        if (others.length > 0) {
                            others.forEach((other, i) => {
                                values.push([other, insertedId, Types.other])
                            })
                        }
                    }

                    if(values.length>0){
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
                                res.json(response(false, err.toString(), { product: result.rows }));
                                res.end();
                            })
                    } else {
                        res.json(response(false, 'success', { product: result.rows }));
                        res.end();
                    }
                }
            })
            .catch(err=>{
                console.log(err.toString());
                badRequest(req,res);
            })


    }

}

editNewsRouter.put('/',verifyToken,checkFolderImage,checkFolderVideo,checkFolderOther,
    uploader.any(),
    getOldFiles,
    editNewsFunction);

export {editNewsRouter};