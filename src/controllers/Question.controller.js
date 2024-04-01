import chalk from "chalk";
import Question from "../models/Question.model.js";
import { STATUS } from "../utils/StatusCode.js";
import { ApiError } from "../utils/ApiError.js";
import { validateObjectId } from "../utils/ZodSchema.js";
import { ObjectId } from "mongodb";
export async function getQuestions(req, res) {
  try {
    let conditions = [
      { $eq: ['$question', '$$questionId'] },
      {$eq : ["$status", "notSolved"]} // we are writting invalid value for status sothat we don't get any result when user is not there.
    ]
    // console.log(req.user);
    if (req.user) {
      conditions = [      { $eq: ['$question', '$$questionId'] },
      { $eq: ['$user',new ObjectId(req.user._id)] },
      {$eq : ["$status", "Accepted"]}]
    }

    const questions = await Question.aggregate([
      {
        $lookup: {
          from: 'submissions',
          let: { questionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: conditions
                }
              }
            }
          ],
          as: 'userSubmission'
        }
      },
      {
        $addFields: {
          hasSubmission: { $gt: [{ $size: '$userSubmission' }, 0] }
        }
      },
      {
        $project: {
          _id : 1,
          questionNo : 1,
          questionName : 1,
          level : 1,
          hasSolved : "$hasSubmission"
          // Exclude the userSubmission field from the final result if not needed
        }
      }
    ]).exec();
    // console.log("questions are ", )
    return res.status(STATUS.OK).send({ message: "Success", data: questions });
  } catch (error) {
    console.log(chalk.red("Error in getQuestion controller : ", error));
    return res
      .status(STATUS.SERVERERROR)
      .send({ message: "Something went wrong" });
  }
}

export async function getQuestionById(req, res,next) {
  const bodyObject = {_id : req.params._id};
  console.log(req.params)
  const result = validateObjectId(bodyObject);
  if (!result.success) {
    console.log(chalk.red(result.message));
    next(new ApiError(STATUS.BADREQUEST,result.message));
  } else {
    console.log(result);
    const question = await Question.findOne({
      _id: result.data._id,
      isDelete: false,
    }).select([
      "_id",
      "questionNo",
      "questionName",
      "description",
      "recommendedCode",
      "testCasesToDisplay",
      "expectedOutputOfHiddenTestCasesToDisplay",
      "examples",
      "constraint",
      "level",
      "Tags",
      "Author",
    ]);
    console.log(question);
    return res
      .status(STATUS.OK)
      .send({ message: "Question fetched successful", data: question });
  }
}
