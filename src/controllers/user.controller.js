import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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


export {registerUser}