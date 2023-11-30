import { loginByRefreshToken } from "../controllers/Auth.controller.js";
import { Router } from "express";
import { login, signup } from "../controllers/Auth.controller.js";

const AuthRouter = Router();

AuthRouter.post('/signup',signup);
AuthRouter.post('/login', login);
AuthRouter.post('/login-by-refreshtoken', loginByRefreshToken);

export default AuthRouter;