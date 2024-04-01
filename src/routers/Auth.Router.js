import { Router } from "express";
import { login, signup, loginByRefreshToken, logout } from "../controllers/Auth.controller.js";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
const AuthRouter = Router();

AuthRouter.post('/signup',signup);
AuthRouter.post('/login', login);
AuthRouter.post('/login-by-refreshtoken', loginByRefreshToken);
AuthRouter.put('/logout',authenticationToken, logout);
export default AuthRouter;