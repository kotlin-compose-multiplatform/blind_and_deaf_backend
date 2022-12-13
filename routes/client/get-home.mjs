import express  from "express";
import { db } from "../../modules/database/connection.mjs";
import { getCertificateHomeQuery, getLatestNewsQuery, getOurProjectsHome } from "../../modules/query/user.mjs";
import { badRequest, response } from "../../modules/response.mjs";

const getHomeRouter=express.Router();

getHomeRouter.get('/',(req,res)=>{
    db.query(`${getLatestNewsQuery} ${getOurProjectsHome} ${getCertificateHomeQuery}`)
    .then(result=>{
        res.json(response(false,'success',{
            latest_news:result[0].rows,
            our_projects:result[1].rows,
            get_certificates:result[2].rows,
        }));
        res.end();
    })
    .catch(err=>{
        badRequest(req,res);
    })
})

export default getHomeRouter;