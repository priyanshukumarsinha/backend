import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {isPasswordCorrect} from '../models/user.model.js'

const registerUser = asyncHandler( async(req, res) => {
    // ALGORITHM: 
    //TODO:
    // Take data from user as per user model (from frontend)
    // (Validation) : Check if the data is as per our need (all required fields are present) 
    // Check if the user already exists : can be checked using username and email
    // Check for files (images), check for avatar (required)
    // upload them (files) to cloudinary, check for avatar (required)
    // create User Object : create entry in db (add user in mongodb Database (if all conditions true))
    // check for user creation : remove password and refreshToken field from response 
    // then, return response

    // Take data from user as per user model (from frontend)
    const {fullName, username, email, password} = req.body

    // (Validation) : Check if the data is as per our need (all required fields are present) 
    if(
        [fullName, username, email, password].some((field) => field?.trim() === '')
    ) throw new ApiError(400, "Required Field Empty!!");
    
    // Check if the user already exists : can be checked using username and email
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser) throw new ApiError(401, "User with email or username Already Exists !!");

    // Check for files (images), check for avatar (required)
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path : had problem with this

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) throw new ApiError(402, "Avatar File is required !!");

    // upload them (files) to cloudinary, check for avatar (required)
    const avatar = await uploadOnCloudinary(avatarLocalPath); // uploads avatar
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // uploads coverImage
    
    if(!avatar) throw new ApiError(500, "Avatar File not uploaded !!");

    // create User Object : create entry in db (add user in mongodb Database (if all conditions true))
    const user = await User.create({
        fullName : fullName.trim(), 
        avatar : avatar.url, 
        coverImage: coverImage?.url || "", 
        username : username.trim().toLowerCase(), 
        email : email.trim().toLowerCase(), 
        password,
    })
    // checking if user exists now (i.e if user is created)
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) throw new ApiError(501, "Something Went Wrong while registering User!!, Please Try Again.");

    // then, return response
    const response = new ApiResponse(201, createdUser, "User Created Successfully !!")
    res.status(200).json(response)

})


const loginUser = asyncHandler( async(req, res) => {
    // TODO:
    // Take data from (req.body) user (i.e email/username and password)
    // Validation : Check if the data is as per our need
    // Find the user : check if any User exists with this username or email in DB
    // If User exists, Password Check 
    // Access and Refresh Token Generation
    // Send them as Cookies
    // send response

    // Take data from (req.body) user 
    const {email, username, password} = req.body;

    // Validation : Check if the data is as per our need
    if(!username || !email) throw new ApiError(402, "Username or Email is Required !!");

    // Find the user : check if any User exists with this username or email in DB
    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user) throw new ApiError(404, "User with this email or username Does not Exist !!");

    // If User exists, 
    // Password Check 
    // for this we can use the isPasswordCorrect method defined in user.model.js

    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if(!isPasswordValid) throw new ApiError(403, "Invalid User Credentials !!");

    // Access and Refresh Token Generation
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    // Send them as Cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
        // To send cookies, we need to design some options first
        // Now they can only be modified from server
    const options = {
        httpOnly : true, //httpOnly	: Boolean : Flags the cookie to be accessible only by the web server.
        secure : true, //secure : Boolean : Marks the cookie to be used with HTTPS only.
    }

    // send response
    // All res.cookie() does is set the HTTP Set-Cookie header with the options provided. 
    // Any option not specified defaults to the value stated in RFC 6265.
    return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new ApiResponse(
                        200, 
                        {
                            user : loggedInUser, 
                            accessToken, 
                            refreshToken
                        }, 
                        "User Logged in Successfully !!"
                    )
                )

})

const logoutUser = asyncHandler(async(req, res) => {
    // User.findById()
    // res.clearCookie()
})

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // AccessToken is given to the user
        // But the refreshToken is also saved in the DB, so that we don't have to ask for password again and again from the user
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });
        // validateBeforeSave is used so that we dont have to give password again to save the data

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Refresh and Access Token")
    }
}

export {registerUser, loginUser}