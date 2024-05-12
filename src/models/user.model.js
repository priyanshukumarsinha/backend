import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        watchHistory : {
            type : [
                {
                    type : Schema.Types.ObjectId,
                    ref : "Video",
                }
            ],
        },
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true, //makes the field easily searchable
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true,
        },
        avatar : {
            type : String, // Cloudnary URL
            required : true,
        },
        coverImage : {
            type : String,
        },
        password : {
            type : String,
            required : [true, 'Password is required'],
        },
        refreshToken : {
            type : String,
        },
    }
    , {timestamps : true})

// this hook will change password every time we saves data
// here we use function(){}, so that we can have context (this)
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
}) 

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)



// multer is used to handle files uploaded from html forms and bring them as request to handle in JS
// cloudinary is then used to upload the file to the storage (bucket)

// What we will do is : 
//  - take file uploaded from user and keep it in localstorage
//  - then we will upload the file from localstorage to the server
// It is done, if the file is not uploaded on cloudinary due to some error, we can reattempt