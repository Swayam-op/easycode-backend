import chalk from "chalk";
import Question from "../models/Question.model.js";
import { STATUS } from "../utils/StatusCode.js";
import { ApiError } from "../utils/ApiError.js";
import { validateObjectId } from "../utils/ZodSchema.js";

export async function getQuestions(req, res) {
  try {
    let solvedQuestions = [];
    let hasAttempted = [];
    // console.log(req.user);
    if (req.user) {
      solvedQuestions = req.user.solvedQuestions;
      hasAttempted = req.user.submissions.map((item) => item.question_id);
    }
    // console.log("solved Questions", solvedQuestions);
    const questions = await Question.aggregate([
      {
        $project: {
          _id: 1,
          questionName: 1,
          level: 1,
          // Include other selected properties
          hasSolvedProblem: {
            $in: ["$_id", solvedQuestions],
          },
          hasAttempted: {
            $in: ["$_id", hasAttempted],
          },
        },
      },
    ]).exec();
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
