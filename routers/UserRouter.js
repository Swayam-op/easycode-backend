import { Router } from "express";
import {STATUS} from '../utils/StatusCode.js'
const userRouter = Router();

userRouter.post('/signup',(req,res)=>{
    const data = req.body;
    console.log("signup data is : ", data);
    return res.status(STATUS.OK).send({message: "signup done"})
})

export default userRouter;