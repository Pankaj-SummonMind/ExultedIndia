import User from "../models/users.models.js";
import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";

async function registerUser(req,res,next){
  try {
    const { name , mobileNumber,email,message } = req.body;
    
    if(
      [name, mobileNumber].some((field) => field?.trim() === "")
    ){
      throw new ApiError(400, "Name and Phone number are required")
    }
    
    const newUser = new User({name,mobileNumber,email,message})
    await newUser.save()
    .then(() => {
       new ApiResponse(201, "User saved Successfully")
    })

    const createdUser = await User.findById(newUser._id).select("-_id name mobileNumber email message")
    console.log("created user: ", createdUser);

    if(!createdUser){
      throw new ApiError(500,"somthing went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered Successfully")
    )
  } catch (error) {
    console.log("error in creating user backend ",error)
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success : error.success,
      message: error.message
    })
  }
}

export {
    registerUser
}