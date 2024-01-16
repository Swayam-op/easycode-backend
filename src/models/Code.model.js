import mongoose, { Schema } from "mongoose";
import User from "./User.model.js";
import Question from "./Question.model.js";

const schema = new Schema({
    question : {
        type: Schema.Types.ObjectId,
        ref : Question
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : User
    },
    sourceCode : String,
    language : {
        // id : 13, name : "python"
    },
    stdout : String,
    timeTaken : String,
    memory : String,
    status : String,
    status_id : Number,
    isDelete : {
        type: Boolean,
        default : false
    }
},{
    timestamps : true
})

const Code = mongoose.model('code', schema);

export default Code;