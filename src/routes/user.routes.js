import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router()

router.route("/register").post(registerUser)
// http://lcalhost:3000/api/v1/users/register

// router.route("/login").post(registerUser)
// http://lcalhost:3000/api/v1/users/login

// router.route("/login").post(registerUser)
// http://lcalhost:3000/api/v1/users/login

export default router



