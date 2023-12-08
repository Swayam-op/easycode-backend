import User from "../models/User.model.js";
import { STATUS } from "../utils/StatusCode.js";


export async function getUserDetails(req, res) {
    console.log(req.user);
    const { username,
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
        solvedproblems,
        recentactivity,
        contributions,
        badges

    } = req.user;

    return res.status(STATUS.OK).json({
        message: "User details received",
        data: {
            username,
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
            solvedproblems,
            recentactivity,
            contributions,
            badges

        }
    });
}