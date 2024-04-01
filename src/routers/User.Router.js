import { Router } from "express";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
import { getUserDetails, getUserShortDetails, isAuthenticated, updateUserDetails, uploadProfilePicture } from "../controllers/user.controller.js";
import { upload } from "../utils/Multer.js";

const userRouter = Router();


userRouter.get('/get-user-details',authenticationToken, getUserDetails);
userRouter.get('/get-user-short-details',authenticationToken,getUserShortDetails)
userRouter.get('/is-authenticated',authenticationToken, isAuthenticated);
userRouter.post('/update-user-details', authenticationToken, updateUserDetails);
userRouter.post('/upload-profile-picture', authenticationToken, upload.single('profile_image'), uploadProfilePicture);
export default userRouter;