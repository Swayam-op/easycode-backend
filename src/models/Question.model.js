import mongoose,{ Schema } from "mongoose";

const schema = new Schema({
    questionName : String,
    Description : String,
    testCases : [
        //{input : "1", output : ["1", "1\n"]}
    ],
    hiddenTestCases : [
        //{input : "1", output : ["1", "1\n"]}
    ],
    constraint : String,
    answer : String,
    level : String,
    Tags : [],
    Author : String,
    isDelete : {
        type: Boolean,
        default : false
    }

},{
    timestamps : true
});

const Question = mongoose.model("question", schema);
export default Question;