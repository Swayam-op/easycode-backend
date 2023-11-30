import mongoose from "mongoose";

const connectDb = async() => {
   try{
      const dbName = process.env.MONGODB_URL;
    const response = await mongoose.connect(dbName);
    return response;
   }
   catch(error){
      return Promise.reject(error);
   }
}

export {connectDb};