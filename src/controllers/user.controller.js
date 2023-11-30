import User from "../models/User.model.js";
import { STATUS } from "../utils/StatusCode.js";


export async function getUserDetails(req, res){
    console.log(req.user);
    const {username,
        email,
        profilepicture,
        fullname,
        bio,
        location,
        socialmedialinks,
        subscriptiontype,
        subscriptionstatus,
        proficientin,
        codinglevel,
        recentactivity,
        contributions,
        badges
        
    } = req.user;
    
    return res.status(STATUS.OK).json({username,
        email,
        profilepicture,
        fullname,
        bio,
        location,
        socialmedialinks,
        subscriptiontype,
        subscriptionstatus,
        proficientin,
        codinglevel,
        recentactivity,
        contributions,
        badges
        
    });
}