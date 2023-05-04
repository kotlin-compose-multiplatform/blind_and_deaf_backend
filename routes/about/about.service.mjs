import multer from 'multer';
import {db} from "../../modules/database/connection.mjs";
import {badRequest} from "../../modules/response.mjs";

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/about');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
export const uploadAboutImage = multer({storage});

export const addAbout = async (req, res) => {
    try {
        // Get the form data from the request body
        const {title_tm, title_ru, title_en, desc_tm, desc_ru, desc_en, type, link_url, is_partner} = req.body;

        // Get the uploaded image file path
        const image = req.file.path;

        // Insert the data into the database
        const query = `INSERT INTO public.about_us(
      title_tm, title_ru, title_en, desc_tm, desc_ru, desc_en, image, type, link_url, is_partner)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const values = [title_tm, title_ru, title_en, desc_tm, desc_ru, desc_en, image, type, link_url, is_partner];
        await db.query(query, values);

        // Send a success response
        res.status(201).json({message: 'New "about us" entry created successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'An error occurred while creating the "about us" entry'});
    }
}


export const updateAbout = async (req, res) => {
    try {
        // Get the ID parameter from the request URL
        const id = req.params.id;

        // Get the existing data for the entry
        const existingDataQuery = 'SELECT * FROM public.about_us WHERE id = $1';
        const existingDataValues = [id];
        const {rows} = await db.query(existingDataQuery, existingDataValues);

        // If an image file is included in the request body, update the image file path
        let image = rows[0].image;
        if (req.file) {
            image = req.file.path;
        }

        // Update the data in the database
        const {title_tm, title_ru, title_en, desc_tm, desc_ru, desc_en, type, link_url, is_partner} = req.body;
        const updateQuery = `UPDATE public.about_us SET
      title_tm = $1, title_ru = $2, title_en = $3, desc_tm = $4, desc_ru = $5, desc_en = $6, image = $7,
      type = $8, link_url = $9, is_partner = $10
      WHERE id = $11`;
        const updateValues = [title_tm, title_ru, title_en, desc_tm, desc_ru, desc_en, image, type, link_url, is_partner, id];
        await db.query(updateQuery, updateValues);

        // Send a success response
        res.status(200).json({message: `Updated "about us" entry with ID ${id}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'An error occurred while updating the "about us" entry'});
    }
}

export const deleteAbout = async (req, res) => {
    try {
        // Get the ID parameter from the request URL
        const id = req.params.id;

        // Delete the entry from the database
        const deleteQuery = 'DELETE FROM public.about_us WHERE id = $1';
        const deleteValues = [id];
        await db.query(deleteQuery, deleteValues);

        // Send a success response
        res.status(200).json({ message: `Deleted "about us" entry with ID ${id}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the "about us" entry' });
    }
}

export const getAboutItems = (req, res) => {
    db.query(`SELECT * FROM public.about_us ORDER BY id DESC`)
        .then(result=>{
            res.json(result.rows);
        })
        .catch(err=>{
            badRequest(req,res);
        })
}






