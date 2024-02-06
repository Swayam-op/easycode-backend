import User from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { STATUS } from "../utils/StatusCode.js";
import { getProfileInfoAggregation, getQuestionSolvedAggregation, getSolutionAggregation, getSubmissionDateAggregation, getSubmissionDetails } from "./AggregationPipelines/user.aggregate.js";
import Solution from "../models/Solutions.model.js";
import Submission from "../models/Submission.model.js";
import Question from "../models/Question.model.js";

export const getUserDetails = asyncHandler(async(req, res)=>{
    const userId = req.user._id;
    const [userDetails, questionsSolvedDetails, solutionsDetails, submissionDates, totalNumberQuestions, submissionDetails] = await Promise.all([
        User.aggregate(getProfileInfoAggregation(userId)),
        Submission.aggregate(getQuestionSolvedAggregation(userId)),
        Solution.aggregate(getSolutionAggregation(userId)),
        Submission.aggregate(getSubmissionDateAggregation(userId)),
        Question.countDocuments({}),
        Submission.aggregate(getSubmissionDetails(userId)), 
    ]);
    const data = {
        userDetails : userDetails? userDetails[0] : null,
        questionsSolvedDetails : questionsSolvedDetails ? questionsSolvedDetails[0] : null,
        solutionsDetails : solutionsDetails ? solutionsDetails[0] : null,
        submissionDates : submissionDates,
        totalNumberQuestions : totalNumberQuestions,
        submissionDetails : submissionDetails
    }
    return res.status(STATUS.OK).json({message : "User details fetched successfully", data : data})
})


export function isAuthenticated(req, res){
    if(req.user){
        return res.status(STATUS.OK).send({message:'User is authenticated', data : null})
    }
}