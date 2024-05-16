// import Router
import { Router } from "express";
import { uploadVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

// import middlewares : 
//  1. upload to help with file uploading : using multer
//  2. and verifyJWT to check if the user is logged in or not


const router = Router();
router.route('/upload-video').post(
    verifyJWT, 
    upload.fields([{name : 'video', maxCount: 1},{name : 'thumbnail', maxCount: 1}]),
    uploadVideo
);

export default router