import { decode } from "jsonwebtoken";
import User from "../models/User.model.js";
import { verifyToken } from "../utils/AuthHelpers.js";
import { STATUS } from "../utils/StatusCode.js";

export async function authenticationToken(req, res, next){
    console.log(req.header('Authorization'));
    const authorizationHeader = req.header('Authorization'); // 'Bearer sdfjnsgjsajgnldfjgkdfg'
    const parts = authorizationHeader? authorizationHeader.split(" ") : "";
    let token;

    try{
        if(parts.length == 2){
            token = parts[1];
        }
        else{
            throw Error("Invalid authorization header format");
        }

        const decoded = verifyToken(token);
        console.log(decoded);
        if(!decoded)
        {
           throw Error("Access denied. Invalid token");
        }

        const user = await User.findOne({_id : decoded._id});
        if(!user || user.accesstoken !== token){
            return res.status(STATUS.UNAUTHORIZED).json({message:"Access denied. Invalid token"});
        }
        req.user = user;
        console.log("Auth clear");
        next();
    }
    catch(error)
    {
        console.log("Error in auth middleware : ");
        if(error.message){
            return res.status(STATUS.UNAUTHORIZED).json({message:error.message});
        }
        return res.status(STATUS.UNAUTHORIZED).json({message:"Access denied. Invalid token"});
    }

}