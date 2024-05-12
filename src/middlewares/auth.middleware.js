// This middleware will just check if the user is present or not

import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"


// when the user logged in, user got refreshToken and accessToken
// On their basis only, we will check if the user has correct refreshToken and accessToken or not : trueLogin
// if trueLogin, i will add a new object inside req, (i.e req.user)
// this req can only be accessed via a middleware : hence we are designing a middleware here

// Header : Authorization : Bearer <token>

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) throw new ApiError(405, "Unauthorized Request !!");
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user) throw new ApiError(406, "Invalid Access Token");
    
        // NEXT_VIDEO : discuss about frontend
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Invalid Access Token !!"
        )
    }

})