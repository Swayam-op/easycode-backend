import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    username:{
        type:String,
        required: true
    },
    password: {
        type:String, // hashed
        required: true
    },
    email:{
        type:String,
        required: true
    },
    profilepicture: String,
    fullname: String,
    bio: String,
    location: String,
    socialmedialinks: [String],
    languagepreference: String,

    subscriptiontype: String,
    subscriptionstatus: Number, // 0 | 1
    proficientin: [String], // react, node, ....
    codinglevel: String, // beginner, intermediate, expert, og

    solvedproblems: {}, // { sp: 10, submissions: 23 }
    recentactivity : [], // [problems solved, contests participated in]
    contributions: [], // blogs

    accesstoken: String,
    refreshtoken: String,

    badges: [], // {batch_id : 1, batch_name: "diamond"}
    solutiontoproblems:[], //[ {qsn:1, solution: ....}, {qsn:2, solution: ....} ]

    contesthistory:[], //{ contestId, ranking}

    useractivitylogs: [] // timestamp

})

const Users = mongoose.model("users", UserSchema);

export default Users;