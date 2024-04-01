import { Router } from "express";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
import { getDiscussionRooms, getUserRoomMessages } from "../controllers/Discussion.controller.js";

const router = Router();

router.get('/get-discussion-rooms',authenticationToken, getDiscussionRooms);
router.get('/get-user-room-messages/:roomId', authenticationToken, getUserRoomMessages);
export default router;