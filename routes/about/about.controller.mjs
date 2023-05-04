import express from 'express';
import {addAbout, deleteAbout, getAboutItems, updateAbout, uploadAboutImage} from "./about.service.mjs";

const aboutController = express.Router();

aboutController.post('/add-about-item',uploadAboutImage.single('image'),addAbout);
aboutController.put('/update-about-item/:id',uploadAboutImage.single('image'),updateAbout);
aboutController.patch('/delete-about/:id',deleteAbout);
aboutController.get(`/get-about-items`,getAboutItems);

export default aboutController;