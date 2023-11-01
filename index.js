import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import userRouter from './routers/UserRouter.js';
import mongoose from "mongoose";


configDotenv({path:'.env'});
const app = express();

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
};
app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URL,{
     useNewUrlParser: true, 
     useUnifiedTopology:true
   });

   const db = mongoose.connection;
   db.on("error",(error)=>{
    console.log("mongodb error")
   });

   db.once("open",()=>{
    console.log("Connected to mongodb");
   })




//routers
app.use('/v1/public_api',userRouter);

app.listen(process.env.PORT,()=>{
    console.log(`server is listening on ${process.env.PORT}`);
});