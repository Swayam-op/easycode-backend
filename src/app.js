import cors from "cors";
import express from "express";

const app = express();

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

//import routers
import userRouter from './routers/User.Router.js';
import AuthRouter from "./routers/Auth.Router.js";
import CodeRouter from "./routers/Code.Router.js";
import QuestionRouter from "./routers/Question.Router.js";

//use routers
app.use('/v1/public_api',AuthRouter);
app.use('/v1/private_api/user',userRouter);
app.use('/v1/private_api/code',CodeRouter);
app.use('/v1/private_api/question',QuestionRouter);



//Global Error Middleware
app.use((err, req, res, next)=>{
        const status = err.status || 500;
        const message = err.message;
        const data = err.data || null;
        console.log("Aa vitare");
        return res.status(status).send({message, data});
})

export {app};