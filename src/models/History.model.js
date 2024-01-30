import mongoose, {Schema} from "mongoose";
import User from './User.model.js';

const schema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : User
    },
    historyType : String,
    message : String,
    description : String,
    isDelete : Boolean

},{
    timestamps : true
})

const History = mongoose.model('History',schema);
export default History;