import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import SocialMedia from "../models/socialMedia.models.js";
import mongoose from "mongoose";

async function createSocialMedia(req, res) {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      throw new ApiError(400, "Key and Value are required");
    }

    const socialMedia = await SocialMedia.create({
      key: key.trim(),
      value: value.trim(),
    });

    return res.status(201).json(
      new ApiResponse(201, socialMedia, "Social media created successfully")
    );
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error",
    });
  }
}

async function getAllSocialMedia(req, res) {
  try {
    const socialMediaList = await SocialMedia.find({ deletedAt: null }).sort({ createdAt: -1 }).select("-__v -updatedAt");

    if (socialMediaList.length === 0) {
      throw new ApiError(404, "No social media links found");
    }

    return res.status(200).json(
      new ApiResponse(200, socialMediaList, "Social media fetched successfully")
    );
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error",
    });
  }
}

async function getSocialMediaById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid social media id");
    }

    const socialMedia = await SocialMedia.findById(id).select("-__v -updatedAt");

    if (!socialMedia) {
      throw new ApiError(404, "No social media found with this id");
    }

    return res.status(200).json(
      new ApiResponse(200, socialMedia, "Social media fetched successfully")
    );
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error",
    });
  }
}

async function updateSocialMedia(req, res) {
  try {
    const { id , key, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid social media id");
    }

    const updateData = {};
    if (key?.trim()) updateData.key = key.trim();
    if (value?.trim()) updateData.value = value.trim();

    const updatedSocialMedia = await SocialMedia.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v -updatedAt");

    if (!updatedSocialMedia) {
      throw new ApiError(404, "No social media found with this id");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedSocialMedia, "Social media updated successfully")
    );
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error",
    });
  }
}

async function deleteSocialMedia(req, res) {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid social media id");
    }

    const deletedSocialMedia = await SocialMedia.findByIdAndUpdate(
          id,
          { deletedAt: new Date() },
          { returnDocument: "after", }
        );

    if (!deletedSocialMedia) {
      throw new ApiError(404, "No social media found with this id");
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Social media deleted successfully")
    );
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error",
    });
  }
}

export {
  createSocialMedia,
  getAllSocialMedia,
  getSocialMediaById,
  updateSocialMedia,
  deleteSocialMedia,
};