import { io } from "../app.js";
import Discussion from "../models/Discussion.model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

const discussionRooms = {};

export const discussion_socket = () => {
    io.on("connection", (socket) => {
        console.log("user is connected", socket.id)
        socket.on("join_room", async (data) => {
            // only teamName and userName present in data
            console.log("data in join_room", data);
            const { roomId, userId } = data;

            //Validate roomId
            const isRoomExist = await Discussion.findOne({
                _id: roomId
            });

            if (isRoomExist) {
                const user = await User.findOne({
                    _id: userId,
                    isDelete: false
                }).select({
                    username: 1,
                    profilepicture: 1,
                    codinglevel: 1
                });
                
                
                if (user) {

                    const userDetails = {
                        _id : userId,
                        userName : user.username,
                        profilePicture : user.profilepicture,
                        codingLevel : user.codinglevel,
                        openedTabs : 1 // how many tabs are opened for same user
                    }
                    
                    //Check roomId is present in discussionRooms as a key
                    if (discussionRooms[roomId]){
                        if(discussionRooms[roomId][userId]){
                            // if user is already opened in another tab
                            userDetails.openedTabs++;
                        }
                        discussionRooms[roomId][userId] = userDetails;
                    }
                    else {
                        discussionRooms[roomId] = {};
                        discussionRooms[roomId][userId] = userDetails;
                    }
                    console.log(`${socket.id} ${user.username} joined ${roomId}`);
                    socket.userId = userId;
                    socket.join(roomId);

                    const activeUsers = Object.values(discussionRooms[roomId]);
                    io.to(roomId).emit('activeUsers', activeUsers);
                }
            }

        });

        socket.on("message_to_room", async(data) => {
            console.log("data in message_to_team", data);
            const { text, file, roomId } = data;
            if(discussionRooms[roomId]){
                const userId = socket.userId;
                try{
                    await Message.create({
                        sender : userId,
                        room : roomId,
                        text : text,
                        file : ""
                    });
                    
    
                    //There is no need to check that user is present in discussionRooms[roomId][userId]
                    socket.to(roomId).emit('message_from_room', {
                    text: text,
                    data : '',
                    userName: discussionRooms[roomId][userId].userName,
                    profilePicture : discussionRooms[roomId][userId].profilePicture,
                    createdAt: new Date().toLocaleString()
                })
                }
                catch(error){
                    socket.emit('error',"Message Could not be sent");
                } 
            }
            
        })

        socket.on("discussion_disconnect", (roomId) => {
            const userId = socket.userId;
            if (discussionRooms[roomId] && discussionRooms[roomId][userId]){
                //If discussion page is opened in one tab then delete, otherwise decreament it
                if(discussionRooms[roomId][userId].openedTabs === 1)
                delete discussionRooms[roomId][userId];
                else
                discussionRooms[roomId][userId].openedTabs--;
            }
            let activeUsers = [];
            if (discussionRooms[roomId]) {
                activeUsers = Object.values(discussionRooms[roomId]);
            }
            socket.leave(roomId);
            console.log("user disconnected from team", socket.userId)
            socket.to(roomId).emit('activeUsers', activeUsers);
        })

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id, socket.userId);
        });

    });

}
