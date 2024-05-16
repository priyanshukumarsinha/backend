// 1. import asyncHandler 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Video } from "../models/video.model.js";

// 1. upload Video (allow to upload only if user is loggedIn : verifyJWT)
const uploadVideo = asyncHandler(async(req, res) => {
    // Algorithm : 
    // takes data from user
    // Validation : data is as per our need or not
    // take files from user
    // Upload Video file on cloudinary
    // create Video Object : create entry in db (add video in mongodb Database (if all conditions true))
        // set the owner to current user
        // Set duration
        // set isPublished to true;
    // checking if video exists now (i.e if video is uploaded)
    // send response

    // takes data from user
    const {title, description} = req.body;
    
    // Validation : data is as per our need or not
    if(!title) throw new ApiError(404, "title is Missing!!");
    // description can be empty;
    
   // Check for files : here we can use req.files because we are using multer
   const videoLocalPath = req.files?.video[0]?.path
   const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    // Check for both files, if present (required)
    if(!videoLocalPath || !thumbnailLocalPath) throw new ApiError(404, "Video FIle or Thumbnail File Missing!!");

    // Upload Video file on cloudinary
    const videoFile = await uploadOnCloudinary(videoLocalPath); // uploads video
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath); // uploads thumbnail

    if(!videoFile || !thumbnail) throw new ApiError(500, "Files not uploaded !!");


    // create Video Object : create entry in db (add video in mongodb Database (if all conditions true))
    const video = await Video.create({
        videoFile : videoFile.secure_url,
        thumbnail : thumbnail.secure_url,
        // set the owner to current user
        owner : req.user._id,
        title,
        description,
        // Set duration
        duration : videoFile.duration,
        // set isPublished to true;
        isPublished : true,
    })

    // checking if video exists now (i.e if video is uploaded)
    const uploadedVideo = await Video.findById(video._id)
    if(!uploadedVideo) throw new ApiError(500, "Video Upload Failed!!")
    
    // send response
    res.status(200).json(
        new ApiResponse (
            200,
            uploadedVideo,
            "Input Taken Successfully !!"
        )
    )

})

// 2. delete Video
const deleteVideo = asyncHandler(async(req, res) => {
    // Algorithm :
    // take videoId from params
    // delete the video and thumbnail file from cloudinary
    // delete the object with videoId from DB
    // return response
    
    // take videoId from params
    const {videoId} = req.params
    const video = await Video.findById(videoId)
    if(!video) throw new ApiError(404, "Video Not Found!!");
    
    // delete the video and thumbnail file from cloudinary
    
    // delete the object with videoId from DB
    const deletedVideo = await Video.deleteOne(video)
    if(!deletedVideo) throw new ApiError(500, "Video Deletion Failed!!");

    // return response
    res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Video Deleted Successfully!"
        )
    )
    

})

// TODO:
// 2. update Video
// 3. delete Video



export {
    uploadVideo,
    deleteVideo
}