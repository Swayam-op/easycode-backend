import { configDotenv } from "dotenv";
import { connectDb } from "./DB/index.js";
import { app } from "./app.js";

configDotenv({path:'.env'});


//Connect Database

connectDb()
.then(()=>{
    console.log("Connected to mongodb");
    app.listen(process.env.PORT,()=>{
        console.log(`server is listening on ${process.env.PORT}`);
    });
})
.catch((error)=>{
    console.log("mongodb error",error)
})



