import User from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { STATUS } from "../utils/StatusCode.js";
import { getProfileInfoAggregation, getSolutionAggregation, getSubmissionDateAggregation, getSubmissionDetails, getTotalSolvedQuestions, getSolvedQuestionsByLevel } from "./AggregationPipelines/user.aggregate.js";
import Solution from "../models/Solutions.model.js";
import Submission from "../models/Submission.model.js";
import Question from "../models/Question.model.js";
import cloudinary from "../utils/Cloudnary.js";
import fs from 'fs';
import { ApiError } from "../utils/ApiError.js";

export const getUserDetails = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const [userDetails, solutionsDetails, submissionDates, totalNumberQuestions, totalQuestionSolved, submissionDetails, countSubmission] = await Promise.all([
        User.aggregate(getProfileInfoAggregation(userId)),
        Solution.aggregate(getSolutionAggregation(userId)),
        Submission.aggregate(getSubmissionDateAggregation(userId)),
        Question.countDocuments({}),
        Submission.aggregate(getTotalSolvedQuestions(userId)),
        Submission.aggregate(getSubmissionDetails(userId)),
        Submission.countDocuments({ user: userId })
    ]);
    const [totalEasy, totalMedium, totalHard, solvedEasy, solvedMedium, solvedHard] = await Promise.all([
        Question.countDocuments({ level: 'easy' }),
        Question.countDocuments({ level: 'medium' }),
        Question.countDocuments({ level: 'hard' }),
        Submission.aggregate(getSolvedQuestionsByLevel('easy', userId)),
        Submission.aggregate(getSolvedQuestionsByLevel('medium', userId)),
        Submission.aggregate(getSolvedQuestionsByLevel('hard', userId))
    ])
    const questionsSolvedDetails = {
        totalQuestions: totalNumberQuestions,
        totalSolvedQuestions: totalQuestionSolved[0].count,
        totalEasy,
        totalMedium,
        totalHard,
        solvedEasy: solvedEasy.length,
        solvedHard: solvedHard.length,
        solvedMedium: solvedMedium.length
    }
    console.log("solution details", solutionsDetails)
    const data = {
        userDetails: userDetails.length !== 0 ? userDetails[0] : {},
        questionsSolvedDetails: questionsSolvedDetails,
        solutionsDetails: solutionsDetails.length !== 0 ? solutionsDetails[0] : [],
        submissionDates: submissionDates,
        submissionDetails: submissionDetails,
        countSubmission: countSubmission
    }
    console.log(data);
    return res.status(STATUS.OK).json({ message: "User details fetched successfully", data: data })
})


export function isAuthenticated(req, res) {
    if (req.user) {
        const data = {
            userName: req.user.username,
            profilePicture: req.user.profilepicture,
        }
        return res.status(STATUS.OK).json({ message: 'User is authenticated', data: data })
    }
    res.status(STATUS.UNAUTHORIZED).json({ message: 'User is not authenticated', data: null })
}

export function getUserShortDetails(req, res) {
    if (req.user) {
        return res.status(STATUS.OK).json({
            message: "Data fetched successfully",
            data: {
                _id: req.user._id,
                userName: req.user.username,
                fullname: req.user.fullname,
                profilePicture: req.user.profilepicture,
                codingLevel: req.user.codinglevel,

            }
        })
    }
    // this line should not be executed because of middleware
    return res.status(STATUS.UNAUTHORIZED).json({
        message: "User is not authenticated"
    })
}


export const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullname, portfolio, linkdin, twitter, github, college, company, location, bio } = req.body;
    console.log(fullname, "update is starting")
    await User.updateOne({ _id: req.user._id }, {
        fullname, portfolio, linkdin, twitter, github, college, company, location, bio
    });
    return res.status(STATUS.OK).json({ data: [], message: "Details updated successfully" });
})


export const uploadProfilePicture = asyncHandler(async (req, res) => {

    if (req.errorMessage) {
        throw new ApiError(STATUS.BADREQUEST, req.errorMessage);
    }
    else {
        if (!req.file || !req.file.path) {
            throw new ApiError(STATUS.BADREQUEST, 'Please select a file');
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        // Send the Cloudinary URL of the uploaded image back to the frontend

        res.status(STATUS.ACCEPTED).json({ message: "Image uploaded successfully", data: { imageUrl: result.secure_url } });
        console.log("file is submitted");
        await User.updateOne({ _id: req.user._id }, { profilepicture: result.secure_url })
    }
    // console.log("file is", req.file);

    //delete file from uploads folder
    fs.unlink(req.file.path, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log('File deleted successfully');
    });
})