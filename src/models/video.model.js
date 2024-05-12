import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema(
    {
        videoFile : {
            type : String,
            required : true,
        },
        thumbnail : {
            type : String,
            required : true,
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User",
        },
        title : {
            type : String,
            required : true,
        },
        descripton : {
            type : String,
            required : true,
        },
        duration : {
            type : Number,
            required : true,
        },
        views : {
            type : Number,
            default : 0,
            required : true,
        },
        isPublished : {
            type : Boolean,
            required : true,
            default : true,
        },
    }
    , {timestamps : true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.models("Video", videoSchema)