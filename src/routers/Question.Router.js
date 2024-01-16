import { Router } from "express";
import { getQuestionById, getQuestions } from "../controllers/Question.controller.js";
import { questionMiddleware } from "../Middleware/Questions.middleware.js";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";


const QuestionRouter = Router();

QuestionRouter.get('/get-questions', questionMiddleware, getQuestions);
QuestionRouter.get('/get-question-by-id/:_id',authenticationToken, getQuestionById);

export default QuestionRouter;