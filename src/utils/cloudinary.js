import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
// fs : file system (comes with node_modules already installed)
// used to manage file
// Mainly what we need from here is filepath
// how fs works is :
//  - it links or unlinks files from fs

// cludinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// So first, we will upload the file to cloudinary, and then unlink file
const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto",
        })
        // file has been uploaded successfully
        return response;
    } catch (error) {
        // remove the locally saved temporary file as the upload operation got failed
        return null;
    } finally{
        fs.unlink(localFilePath, () => {})
    }
}

export {uploadOnCloudinary}

// const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
//         public_id: "shoes"
//     }).catch((error)=>{console.log(error)});
    
//     console.log(uploadResult);

// files will come to us from filesystem : it will give us path of localfile i.e Server
// from server we will get a localfile path which we can use to upload file on cloudinary

// Now if the file is already uploaded on cloudinary, we don't need it to be on the server
// Hence, we will delete it from the server