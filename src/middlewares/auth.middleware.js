// This middleware will just check if the user is present or not

import { asyncHandler } from "../utils/asyncHandler";


// when the user logged in, user got refreshToken and accessToken
// On their basis only, we will check if the user has correct refreshToken and accessToken or not : trueLogin
// if trueLogin, i will add a new object inside req, (i.e req.user)
// this req can only be accessed via a middleware : hence we are designing a middleware here

export const verifyJWT = asyncHandler(async(req, res, next) => {
    req.cookie()
})