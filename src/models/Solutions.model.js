import mongoose,{Schema} from "mongoose";
import User from "./User.model.js";
import Question from "./Question.model.js";

const schema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : User
    },
    question : {
        type : Schema.Types.ObjectId,
        ref : Question
    },
    title: String,
    content : String
    // likes and replies will be in different model
},{
    timestamps : true
});

const Solution = mongoose.model('solution', schema);
export default Solution;