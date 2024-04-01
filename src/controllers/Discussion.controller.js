import Discussion from "../models/Discussion.model.js";
import Message from "../models/Message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { STATUS } from "../utils/StatusCode.js";
import { previousMessagesAggregation } from "./AggregationPipelines/dicussion.aggregate..js";

export const getDiscussionRooms = asyncHandler(async(req, res)=>{
    const rooms = await Discussion.find({});
    res.status(STATUS.OK).json({
        message : "Discussion rooms fetched successfully",
        data : rooms
    });
})

export const getUserRoomMessages = asyncHandler(async(req, res)=>{
    const {roomId} = req.params;
    console.log(req.body);
    if(!roomId){
        throw new ApiError(STATUS.BADREQUEST, "Invalid RoomId")
    }
    const [roomDetails, previousMessages] = await Promise.all([
        Discussion.findOne({_id : roomId}),
        Message.aggregate(previousMessagesAggregation(roomId))
    ]);
    
    const userDetails = {
        _id : req.user._id,
        userName: req.user.username,
    }

    res.status(STATUS.OK).json({
        message : "User, Room & Messages details fetched successfully",
        data : {
            roomDetails,
            userDetails,
            previousMessages : previousMessages.reverse()
        }
    })
})