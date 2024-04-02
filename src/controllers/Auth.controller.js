import User from "../models/User.model.js";
import { STATUS } from "../utils/StatusCode.js";
import { ApiError } from "../utils/ApiError.js";
import {
  hashPassword,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  compareUserPassword,
} from "../utils/AuthHelpers.js";
import { validPassword, valideEmail } from "../utils/ValidationCheck.js";
import { validateSignUpInputs } from "../utils/ZodSchema.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export async function loginByRefreshToken(req, res) {
  const { refreshtoken } = req.body;
  if (!refreshtoken) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided" });
  }

  const decoded = verifyToken(refreshtoken);
  if (!decoded) {
    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ message: "Access denied. Invalid token" });
  }

  try {
    let user = await User.findOne({ _id: decoded._id });
    if (!user || user.refreshtoken !== refreshtoken) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: "Access denied. Invalid token" });
    }

    // Generate access token and refresh token
    const accesstoken = await generateAccessToken({ _id: user._id });
    const new_refreshtoken = await generateRefreshToken({ _id: user._id });

    user.accesstoken = accesstoken;
    user.refreshtoken = new_refreshtoken;
    await user.save();

    console.log("new accesstoken, refreshtoken", accesstoken, new_refreshtoken);
    return res.status(STATUS.OK).json({ accesstoken, new_refreshtoken });
  } catch (error) {
    console.log("Error in auth loginbyRefreshTOken : ");
    return res
      .status(STATUS.UNAUTHORIZED)
      .json({ message: "Access denied. Invalid token" });
  }
}

export const signup = asyncHandler(async (req, res) => {
  //validate input fields
  const inputCheck = validateSignUpInputs(req.body);
  console.log(req.body);

  if (inputCheck.success === false) {
    throw new ApiError(STATUS.BADREQUEST, inputCheck.message);
  }

  const { username, email, password, confirmpassword } = inputCheck.data;

  if (password !== confirmpassword) {
    return res
      .status(STATUS.BADREQUEST)
      .json({ message: "No match in password & confirm password" });
  }
  //check if the email and username are already registered
  const existingUser = await User.findOne({ email, username });
  if (existingUser) {
    return res
      .status(STATUS.BADREQUEST)
      .json({ message: "Email is already in use." });
  }

  //Hash the password
  const hashedPassword = await hashPassword(password);

  //create a new user instance
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  //save the new user to database
  await newUser.save();
  return res
    .status(STATUS.CREATED)
    .json({ message: "User redistered successfully." });
});

export async function login(req, res) {
  // userCred -> it might be username or email
  const { userCred, password } = req.body;
  console.log("Data from front-end : ", req.body);

  if (!userCred || !password) {
    return res
      .status(STATUS.BADREQUEST)
      .json({ message: "All fields must be filled." });
  }
  try {
    //find the user by userCred
    const user = await User.findOne({
      $or: [{ username: userCred }, { email: userCred }],
    });

    if (!user) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: "User not found" });
    }

    console.log("User details : ", user);
    // Compare the provided password with stored hashed password
    const passwordMatch = await compareUserPassword(user.password, password);

    if (!passwordMatch) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }

    // Generate access token and refresh token
    const accesstoken = await generateAccessToken({ _id: user._id });
    const refreshtoken = await generateRefreshToken({ _id: user._id });

    user.accesstoken = accesstoken;
    user.refreshtoken = refreshtoken;
    await user.save();
    
    const data = {
      userName : user.username,
      profilePicture : user.profilepicture,
      fullName : user.fullname
    }
    return res 
      .status(STATUS.OK)
      .json({ message: "Login successfull", accesstoken, refreshtoken, data });
  } catch (error) {
    console.log("Error in login", error);
    return res
      .status(STATUS.SERVERERROR)
      .json({ message: "Internal server error" });
  }
}

export const logout = asyncHandler(async(req, res)=>{
  const user = req.user;
  if(user){
    await User.updateOne({_id : user._id}, {
      accesstoken : "",
      refreshtoken : ""
    });
    res.status(STATUS.OK).json({message : "Logout Successfully", data: null})
  }
  else{
    throw new ApiError(STATUS.UNAUTHORIZED,"Invalid Token");
  }
})