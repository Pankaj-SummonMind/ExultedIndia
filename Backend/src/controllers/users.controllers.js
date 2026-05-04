import User from "../models/users.models.js";
import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import mongoose from "mongoose";

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

    const createdUser = await User.findById(newUser._id).select("-_id name mobileNumber email message createdAt")

    if(!createdUser){
      throw new ApiError(500,"somthing went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered Successfully")
    )
  } catch (error) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success : error.success,
      message: error.message
    })
  }
}


async function getAllUsers(req, res) {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 });

    if(!users){
      throw new ApiError(404,"No users found ")
    }


    return res.status(200).json(
      new ApiResponse(
        200,
        users,
        "Users fetched successfully"
      )
    );

  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}


async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        user,
        "User fetched successfully"
      )
    );

  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

export {
    registerUser,
    getAllUsers,
    getUserById
}