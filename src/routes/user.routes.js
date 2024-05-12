import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([{name : 'avatar', maxCount: 1},{name : 'coverImage', maxCount: 1}]),
    registerUser
)
// http://lcalhost:3000/api/v1/users/register

router.route("/login").post(loginUser)
// http://lcalhost:3000/api/v1/users/login


// SECURED ROUTES
router.route("/logout").post(verifyJWT, logoutUser)
// http://lcalhost:3000/api/v1/users/login

export default router



