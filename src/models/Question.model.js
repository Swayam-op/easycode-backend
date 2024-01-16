import mongoose,{ Schema } from "mongoose";

const schema = new Schema({
    questionName : String,
    questionNo : Number,
    description : [String],
    hiddenCode : [String],
    recommendedCode : String,
    testCases : String, //"1 2 3 4\n"
    hiddenTestCases : String,//"1 2 3 4\n"
    expectedOutputOfTestCases : String, // "2 3 4"
    expectedOutputOfTestCasesToDisplay : [],
    testCasesToDisplay :[], // [2, 3, 4]
    hiddenTestCasesToDisplay : [], //[2, 3, 4]
    expectedOutputOfHiddenTestCases : String, //"2 3 4"
    expectedOutputOfHiddenTestCasesToDisplay : [],//[1,2,3]
    examples : [],
    constraint : [],
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