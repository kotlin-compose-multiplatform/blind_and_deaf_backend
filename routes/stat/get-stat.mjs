import express from 'express';
import {badRequest, response} from "../../modules/response.mjs";
import {db} from "../../modules/database/connection.mjs";
import {verifyToken} from "../../modules/auth/token.mjs";

const getStat = express.Router();

getStat.get('/',verifyToken, async (req, res) => {
    if (typeof req.body === 'undefined' || req.body == null) {
        badRequest(req, res);
    } else {
        db.query(`SELECT value_number AS visits FROM stats WHERE type='visit';
                    SELECT COUNT(id) AS news_count FROM news WHERE is_project=false;
                    SELECT COUNT(id) AS project_count FROM news WHERE is_project=true;
                    SELECT COUNT(id) AS notif_count FROM inbox;
                    SELECT SUM(views) AS news_view FROM news WHERE is_project=false;
                    SELECT SUM(views) AS project_view FROM news WHERE is_project=true;
                    SELECT * FROM inbox ORDER BY created_at DESC LIMIT 10`)
            .then(result=>{
                res.json(response(false,'success',{
                    visits:result[0].rows[0].visits,
                    news_count:result[1].rows[0].news_count,
                    project_count:result[2].rows[0].project_count,
                    notif_count:result[3].rows[0].notif_count,
                    news_view:result[4].rows[0].news_view,
                    project_view:result[5].rows[0].project_view,
                    inbox:result[6].rows
                }));
                res.end();
            })
            .catch(err=>{
                badRequest(req,res);
            })
    }
})

export {getStat};