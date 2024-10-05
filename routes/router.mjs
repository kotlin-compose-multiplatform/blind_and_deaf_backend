import express from "express";
import getHomeRouter from "./client/get-home.mjs";
import { loginRouter } from "./auth/login.mjs";
import { addCertificate } from "./certificate/add-certificate.mjs";
import { deleteCertificate } from "./certificate/delete-certificate.mjs";
import { getCertificate } from "./certificate/get-certificate.mjs";
import { addInbox } from "./client/add-inbox.mjs";
import { getnewsClient } from "./client/get-news.mjs";
import { getSingleClient } from "./client/get-single.mjs";
import { searchRouter } from "./client/search.mjs";
import { getInbox } from "./inbox/get-inbox.mjs";
import { addNewsRouter } from "./news/add-news.mjs";
import { deleteNewsRouter } from "./news/delete-news.mjs";
import { editNewsRouter } from "./news/edit-news.mjs";
import { getnews } from "./news/get-news.mjs";
import { getStat } from "./stat/get-stat.mjs";
import aboutController from "./about/about.controller.mjs";

const router=express.Router();

router.use('/sign-in',loginRouter);
router.use('/get-news',getnews);
router.use('/add-news',addNewsRouter);
router.use('/delete-news',deleteNewsRouter);
router.use('/edit-news',editNewsRouter);
router.use('/add-certificate',addCertificate);
router.use('/get-certificate',getCertificate);
router.use('/delete-certificate',deleteCertificate);
router.use('/get-stat',getStat);
router.use('/get-inbox',getInbox);
router.use('/get-client-home',getHomeRouter);
router.use('/get-client-news',getnewsClient);
router.use('/search',searchRouter);
router.use('/get-single',getSingleClient);
router.use('/add-inbox',addInbox);
router.use('/about',aboutController);

export default router;