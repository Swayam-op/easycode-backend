import User from "../models/User.model.js";
import { verifyToken } from "../utils/AuthHelpers.js";
import { STATUS } from "../utils/StatusCode.js";

export async function authicationToken(req, res, next){
    const token = req.header('Authorization'); // You are getting accesstoken here.
    
    if(!token){
        return res.status(STATUS.UNAUTHORIZED).json({message:"Access denied. No token provided"});
    }

    const decoded = verifyToken(token);
    if(!decoded)
    {
        return res.status(STATUS.UNAUTHORIZED).json({message:"Access denied. Invalid token"});
    }
    try{
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
        return res.status(STATUS.UNAUTHORIZED).json({message:"Access denied. Invalid token"});
    }

}