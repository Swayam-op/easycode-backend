import { Router } from "express";
import { authicationToken } from "../Middleware/Authentication.middleware.js";
import { getUserDetails } from "../controllers/user.controller.js";

const userRouter = Router();


userRouter.get('/get-user-details',authicationToken, getUserDetails)

export default userRouter;