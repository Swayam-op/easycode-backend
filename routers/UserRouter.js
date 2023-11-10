import { Router } from "express";
import { authicationToken } from "../Middleware/Authentication.js";
import { STATUS } from "../utils/StatusCode.js";
import { getUserDetails } from "../controllers/UserController.js";

const userRouter = Router();


userRouter.get('/get-user-details',authicationToken, getUserDetails)

export default userRouter;