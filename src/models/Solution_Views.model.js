import { Schema }  from "mongoose";
import mongoose from "mongoose";
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

const Solution_Views = mongoose.model('solution_views',schema);
export default Solution_Views;