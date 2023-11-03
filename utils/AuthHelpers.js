import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({path:'../.env'});


export async function hashPassword(password){
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword;
}

export async function compareUserPassword( hashedPassword, password){
    const result = await bcrypt.compare( password, hashedPassword);
    return result;
}

export async function generateAccessToken(payload){ 
    //payload : {_id : Object(sdkfjdfdsdfdfd)}
    const secretKey = process.env.SECRET_KEY;
    const expiresIn = 3600; // 1 hour = 3600 seconds;

    //sign the jwt token with payload, secretKey and expiration time
    const token = await jwt.sign(payload, secretKey, { expiresIn });
    return token;
}

export async function generateRefreshToken(payload){
     //payload : {_id : Object(sdkfjdfdsdfdfd)}
     const secretKey = process.env.SECRET_KEY;
     const expiresIn = 86400; // 2 day = 86400 seconds;
 
     //sign the jwt token with payload, secretKey and expiration time
     const token = await jwt.sign(payload, secretKey, { expiresIn });
     return token;
}