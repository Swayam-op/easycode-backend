import { Router } from "express";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
import { getUserDetails, isAuthenticated } from "../controllers/user.controller.js";

const userRouter = Router();


userRouter.get('/get-user-details',authenticationToken, getUserDetails)
userRouter.get('/is-authenticated',authenticationToken, isAuthenticated);
export default userRouter;