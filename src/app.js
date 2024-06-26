import cors from "cors";
import express from "express";
import { Server } from 'socket.io';
import {createServer} from 'http';


const app = express();

const corsOptions ={
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));


const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "https://easycode-pro.vercel.app" ||  "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

//import routers
import userRouter from './routers/User.Router.js';
import AuthRouter from "./routers/Auth.Router.js";
import CodeRouter from "./routers/Code.Router.js";
import QuestionRouter from "./routers/Question.Router.js";
import SolutionRouter from './routers/Solution.Router.js';
import DiscussionRouter from './routers/Discussion.Router.js'
import { create } from "domain";


//API TESTING
app.get('/',(req, res)=>{
  res.json({message : "home"});
})

app.get('/test',(req, res)=>{
  res.json({message : "working"});
})

//use routers
app.use('/v1/public_api',AuthRouter);
app.use('/v1/private_api/auth',AuthRouter);
app.use('/v1/private_api/user',userRouter);
app.use('/v1/private_api/code',CodeRouter);
app.use('/v1/private_api/question',QuestionRouter);
app.use('/v1/private_api/solution',SolutionRouter);
app.use('/v1/private_api/discussion',DiscussionRouter);

//Global Error Middleware
app.use((err, req, res, next)=>{
        const status = err.statusCode || 500;
        const message = err.message;
        const data = err.data || null;
        console.log("Error in GLOBAL ERROR MIDDLEWARE is ", err);
        return res.status(status).send({message, data});
})

//sockets
import { discussion_socket } from "./Sockets/Message.socket.js";
discussion_socket();
 

export {server, io};