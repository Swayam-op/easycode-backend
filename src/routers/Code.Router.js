import { Router } from "express";
import { runCode, submitCode } from "../controllers/Code.controller.js";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
const CodeRouter = Router();

CodeRouter.post('/run-code', authenticationToken, runCode);
CodeRouter.post('/submit-code', authenticationToken, submitCode);
export default CodeRouter;