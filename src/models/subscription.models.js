import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new Schema(
    {
        subscriber : {
            type : Schema.Types.ObjectId, // one who is subscribing // from subscriber we get total number of subscriptions // following
            ref : "User"
        },
        channel : {
            type : Schema.Types.ObjectId, // one who is subscribed // from channel we get total subscribers : follower
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)