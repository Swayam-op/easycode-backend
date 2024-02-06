
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
        default: "https://wallpapers.com/images/high/naruto-pictures-qmc3mjl3e42475o4.webp"
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
    linkdin : {
        type : Object,
        default : {
            name : "",
            url : ""
        }
    }, //{name, url}
    portfolio : {
        type : String,
        default : ""
    }, // 
    college : {
        type : String,
        default : ""
    }, //
    company : {
        type : String,
        default : ""
    }, // 
    github : {
        type : Object,
        default : {
            name : "",
            url : ""
        }
    }, // {name , url}
    twitter : {
        type : Object,
        default : {
            name : "",
            url : ""
        }
    }, // {name , url}
    languagepreference: String,

    proficientin: [String], // react, node, ....

    codinglevel: {
        type:String,
        default: "beginner"
    }, // beginner, intermediate, expert, og

    accesstoken: {
        type:String,
        default: ""
    },
    refreshtoken: {
        type:String,
        default: ""
    },

    badges: [], // {batch_id : 1, batch_name: "diamond"}

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