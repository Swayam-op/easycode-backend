import mongoose from "mongoose";
import { Schema } from "mongoose";
import User from "./User.model.js";
import Discussion from "./Discussion.model.js";

const MessageSchema = new Schema({
    sender : {
        type: Schema.Types.ObjectId,
        ref : User
    },
    room : {
        type: Schema.Types.ObjectId,
        ref : Discussion
    },
    text : String,
    file : String, // Link of cloudnary file

},
{
    timestamps : true
});

const Message = mongoose.model("message", MessageSchema);
export default Message;