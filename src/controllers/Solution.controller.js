import chalk from "chalk";
import Solution from "../models/Solutions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { STATUS } from "../utils/StatusCode.js";
import { validateObjectId } from "../utils/ZodSchema.js";
import { ObjectId } from "mongodb";
import Solution_Views from "../models/Solution_Views.model.js";
import Solution_Likes from "../models/Solution_Likes.model.js";

export const uploadSolution = asyncHandler(async (req, res) => {
  const { title, content, questionId } = req.body;
  const validate = validateObjectId({_id : questionId});
  if (!validate.success) {
    throw new ApiError(STATUS.BADREQUEST, validate.message);
  }
  const solution = new Solution({
    user : req.user._id,
    question : questionId,
    title : title,
    content : content
  });
  await solution.save();
  res.status(STATUS.ACCEPTED).send({message : "Solution submitted successfully", data : null})
 console.log("Sulution submiited");
});

export const getSolutions = asyncHandler(async(req, res)=>{
    const {questionId, skip, count} = req.query;
    const userId = req.user._id;
    console.log("question id solution", questionId)
    const validate = validateObjectId({_id : questionId});
    if (!validate.success) {
      throw new ApiError(STATUS.BADREQUEST, validate.message);
    }
    const solutions = await Solution.aggregate([
        {
          $match: {
            question : new ObjectId(questionId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user_details"
          }
        },
        {
          $addFields: {
            user_detail:{
              $arrayElemAt : ["$user_details",0]
            }
          }
        },
        {
          $project: {
            username : "$user_detail.username",
            profile_picture : "$user_detail.profilepicture",
            title : 1,
            content : 1,
            createdAt : 1
          }
        },
        {
            $lookup: {
              from: "solution_views",
              localField: "_id",
              foreignField: "solution",
              as: "viewsData"
            }
          },
          {
            $lookup: {
              from: "solution_likes",
              localField: "_id",
              foreignField: "solution",
              as: "likesData"
            }
          },
          {
            $addFields: {
              viewsNumber: { $size: "$viewsData" },
              likesNumber : {$size : "$likesData"},
              userHasLiked: {
              $gt: [
                { $size: { $filter: { input: "$likesData", as: "like", cond: { $eq: ["$$like.user", new ObjectId(userId)] } } } },
                0
              ]
            }
            }
          },
          {
            $project: {
              "viewsData" : 0,
              "likesData" : 0
            }
          },
        {
          $sort : {
            createdAt : -1
          }
        },
        {
            $skip : parseInt(skip)
        },
        {
          $limit : parseInt(count)
        }
        
      ]);
    res.status(STATUS.OK).send({message : 'Ok', data : solutions});
    console.log(chalk.green("Solution list is sent", solutions, "skip : ",parseInt(skip)));
})



// if liked then remove, or add
export const alterLikesToSolution = asyncHandler(async(req, res)=>{
    const {solutionId} = req.query;
    const userId = req.user._id;
    const validate = validateObjectId({_id : solutionId});
    if (!validate.success) {
        throw new ApiError(STATUS.BADREQUEST, validate.message);
    }
    const isLiked = await Solution_Likes.countDocuments({solution:solutionId, user : userId});
    if(isLiked === 0){
        const like = new Solution_Likes({
            user : userId,
            solution : solutionId
        })
        await like.save();
        console.lod("like is added");
    }
    else{
        await Solution_Likes.deleteOne({question:questionId, user : userId});
        console.log("like is removed");
    }
})

export const getDetailsOfSolution = asyncHandler(async(req, res)=>{
    const {solutionId} = req.query;
    const userId = req.user._id;
    console.log("solution id in ", solutionId)
    const validate = validateObjectId({_id : solutionId});
    if (!validate.success) {
        throw new ApiError(STATUS.BADREQUEST, validate.message);
    }
    await addViewsToSolution(solutionId, userId);
    let solution = await Solution.aggregate([
        {
          $match: {
            _id : new ObjectId(solutionId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user_details"
          }
        },
        {
          $addFields: {
            user_detail:{
              $arrayElemAt : ["$user_details",0]
            }
          }
        },
        {
          $project: {
            username : "$user_detail.username",
            profile_picture : "$user_detail.profilepicture",
            title : 1,
            content : 1,
            createdAt : 1
          }
        },
        {
            $lookup: {
              from: "solution_views",
              localField: "_id",
              foreignField: "solution",
              as: "viewsData"
            }
          },
          {
            $lookup: {
              from: "solution_likes",
              localField: "_id",
              foreignField: "solution",
              as: "likesData"
            }
          },
          {
            $addFields: {
              viewsNumber: { $size: "$viewsData" },
              likesNumber : {$size : "$likesData"},
              userHasLiked: {
              $gt: [
                { $size: { $filter: { input: "$likesData", as: "like", cond: { $eq: ["$$like.user", new ObjectId(userId)] } } } },
                0
              ]
            }
            }
          },
          {
            $project: {
              "viewsData" : 0,
              "likesData" : 0
            }
          },
      ]);
      solution = solution || [];
    res.status(STATUS.OK).send({message : 'Ok', data : solution[0] || null});
    console.log(chalk.green("Solution list is sent", solution[0]));
})

const addViewsToSolution = async(solutionId, userId)=>{
  return new Promise(async(resolve)=>{
    console.log("solutionId in views: ", solutionId);
    console.log("solutionId in views: ", solutionId);
    const isViewed = await Solution_Views.countDocuments({solution:solutionId, user : userId});
    if(isViewed === 0){
        const view = new Solution_Views({
            solution : solutionId,
            user : userId
        });
        await view.save();
        console.log("view is done. ", view);
    }
    resolve();
  })
}