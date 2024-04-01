import { configDotenv } from "dotenv";
import { connectDb } from "../src/DB/index.js";
import { server } from "../src/app.js";
import { setUpCloudinary } from "../src/utils/Cloudnary.js";

configDotenv({path:'.env'});


//Connect Database

connectDb()
.then(()=>{
    console.log("Connected to mongodb");
    setUpCloudinary();
    server.listen(process.env.PORT,()=>{
        console.log(`server is listening on ${process.env.PORT}`);
    });
})
.catch((error)=>{
    console.log("mongodb error",error)
})



