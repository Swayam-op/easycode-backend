import User from "../models/User.model.js";
import { STATUS } from "../utils/StatusCode.js";


export async function getUserDetails(req, res) {
    console.log(req.user);
}


export function isAuthenticated(req, res){
    if(req.user){
        return res.status(STATUS.OK).send({message:'User is authenticated', data : null})
    }
}