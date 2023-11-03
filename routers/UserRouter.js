import { Router } from "express";
import {STATUS} from '../utils/StatusCode.js'
import { login, signup } from "../controllers/UserController.js";
const userRouter = Router();

userRouter.post('/signup',signup);
userRouter.post('/login', login);

export default userRouter;