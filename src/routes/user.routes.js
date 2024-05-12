import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([{name : 'avatar', maxCount: 1},{name : 'coverImage', maxCount: 1}]),
    registerUser
)
// http://lcalhost:3000/api/v1/users/register

// router.route("/login").post(registerUser)
// http://lcalhost:3000/api/v1/users/login

// router.route("/login").post(registerUser)
// http://lcalhost:3000/api/v1/users/login

export default router



