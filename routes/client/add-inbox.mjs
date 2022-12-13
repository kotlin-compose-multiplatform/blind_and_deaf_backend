import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import nodemailer from "nodemailer";
import {mailerPassword} from "../../modules/constant/constant.mjs";
import {db} from "../../modules/database/connection.mjs";
import {addInboxQuery} from "../../modules/query/user.mjs";

const addInbox = express.Router();

addInbox.post('/', async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'blindanddeafsocietytm@gmail.com',
                pass: mailerPassword
            }
        });

        let mailOptions = {
            from: 'blindanddeafsocietytm@gmail.com',
            to: 'sh.alyyew2019@gmail.com',
            subject: `Ulanyjy ${req.body.username}-dan täze hat geldi`,
            html: `
        <h4>Ulanyjy ${req.body.username}, Elektron poçtasy ${req.body.email}</h4>
        <p>${req.body.text}</p>
        <h5><i>Blind and deaf society of Turkmenistan</i></h5>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                db.query(addInboxQuery,[req.body.username,req.body.email,req.body.text])
                    .then(result=>{
                        res.json(response(false,'success','success'));
                    })
                    .catch(err=>{
                        badRequest(req,res);
                    })
            }
        });
    }
})

export {addInbox};