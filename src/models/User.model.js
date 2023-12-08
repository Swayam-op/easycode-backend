import mongoose from "mongoose";
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
    profilepicture: {
        type:String,
        default: ""
    },
    fullname: {
        type:String,
        default: ""
    },
    bio: {
        type:String,
        default: ""
    },
    location: {
        type:String,
        default: ""
    },
    socialmedialinks: [String],
    languagepreference: String,

    subscriptiontype: {
        type:String,
        default: ""
    },
    subscriptionstatus: {
        type:Number,
        default: 0    }, // 0 | 1

    proficientin: [String], // react, node, ....

    codinglevel: {
        type:String,
        default: ""
    }, // beginner, intermediate, expert, og

    solvedproblems: {
        type : Object,
        default : {sp : 0, submissions : 0}
    }, // { sp: 10, submissions: 23 }
    recentactivity : [], // [problems solved, contests participated in]
    contributions: [], // blogs

    accesstoken: {
        type:String,
        default: ""
    },
    refreshtoken: {
        type:String,
        default: ""
    },

    badges: [], // {batch_id : 1, batch_name: "diamond"}
    solutiontoproblems:[], //[ {qsn:1, solution: ....}, {qsn:2, solution: ....} ]

    contesthistory:[], //{ contestId, ranking}

    useractivitylogs: [], // timestamp

    isDelete : {
        type: Boolean,
        default : false
    }

},
{
    timestamps : true
})

const User = mongoose.model("users", UserSchema);

export default User;