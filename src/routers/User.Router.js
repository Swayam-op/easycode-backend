import { Router } from "express";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
import { getUserDetails } from "../controllers/user.controller.js";

const userRouter = Router();


userRouter.get('/get-user-details',authenticationToken, getUserDetails)

export default userRouter;