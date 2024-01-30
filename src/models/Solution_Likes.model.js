import mongoose, { Schema } from "mongoose";
import User from "./User.model.js";
import Solution from "./Solutions.model.js";

const schema = new Schema({
    solution : {
        type : Schema.Types.ObjectId,
        ref : Solution
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : User
    }
});

const Solution_Likes = mongoose.model('solution_likes',schema);
export default Solution_Likes;