import { decode } from "jsonwebtoken";
import User from "../models/User.model.js";
import { verifyToken } from "../utils/AuthHelpers.js";
import { STATUS } from "../utils/StatusCode.js";

export async function questionMiddleware(req, res, next){
    console.log(req.header('Authorization'));
    const authorizationHeader = req.header('Authorization'); // 'Bearer sdfjnsgjsajgnldfjgkdfg'
    const parts = authorizationHeader? authorizationHeader.split(" ") : "";
    let token;

    try{
        if(parts.length == 2){
            token = parts[1];
        }
        else{
            return next();
        }

        const decoded = verifyToken(token);
        console.log(decoded);
        if(!decoded)
        {
        //    throw Error("Access denied. Session expired");
            return next();
        }

        const user = await User.findOne({_id : decoded._id});
        if(!user || user.accesstoken !== token){
            // return res.status(STATUS.UNAUTHORIZED).json({message:"Access denied. Invalid token"});
            return next();
        }
        req.user = user;
        console.log("Auth clear");
        next();
    }
    catch(error)
    {
        console.log("Error in auth middleware : ");
        return res.status(STATUS.SERVERERROR).json({message:"Server Error"});
    }

}