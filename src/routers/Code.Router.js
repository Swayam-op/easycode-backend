import { Router } from "express";
import { runCode, runCodeForTesting, submitCode, submitForTesting } from "../controllers/Code.controller.js";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
const CodeRouter = Router();

CodeRouter.post('/run-code', runCode);
CodeRouter.post('/submit-code', authenticationToken, submitCode);
CodeRouter.post('/run-code-test',runCodeForTesting);
CodeRouter.post('/submit-code-test',submitForTesting);
export default CodeRouter;