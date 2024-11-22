import express from "express";
import { addFood , editform, edititem, listfood ,removefood } from "../controllers/foodcontroller.js";
import multer from "multer";


const foodRouters = express.Router();

// //image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file , cb)=>{
        return cb(null , `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})


foodRouters.post('/add' ,upload.single('image'), addFood);
foodRouters.get('/list' , listfood );
foodRouters.post('/remove' , removefood );
foodRouters.post('/edit' , edititem);
foodRouters.post('/editform' , editform)


export default foodRouters