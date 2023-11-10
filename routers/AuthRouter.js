import { loginByRefreshToken } from "../controllers/Auth.js";
import { Router } from "express";
import { login, signup } from "../controllers/Auth.js";

const AuthRouter = Router();

AuthRouter.post('/signup',signup);
AuthRouter.post('/login', login);
AuthRouter.get('/login-by-refreshtoken', loginByRefreshToken);

export default AuthRouter;