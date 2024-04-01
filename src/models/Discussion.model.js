import mongoose from "mongoose";
import { Schema } from "mongoose";
const DiscussionSchema = new Schema({
    title : String,
    description : String,
    path_segment : String, // https//:easycode/discussion/{path}
})

const Discussion = mongoose.model('discussion', DiscussionSchema);

export default Discussion;