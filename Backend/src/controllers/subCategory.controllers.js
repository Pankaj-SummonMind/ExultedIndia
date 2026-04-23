import {ApiError} from "../utils.js/ApiError.js"
import {ApiResponse} from "../utils.js/ApiResponse.js"
import Categories from "../models/categories.modal.js"
import SubCategories from "../models/subCategories.modal.js"
import mongoose from "mongoose"


async function CreateSubCategories(req, res) {
  try {
    const { subCategories_Name, subCategories_Description, category_Id } = req.body;

    if (!subCategories_Name || !subCategories_Description || !category_Id) {
      throw new ApiError(400, "Subcategory name, description, and category ID are required");
    }

    // Since a certificate only has one image in the schema `image: { url, public_id }`
    // We expect exactly one file.
    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    
    if (!file) {
      throw new ApiError(400, "Subcategory image is required");
    }

    const filePath = file.path.replace(/\\/g, "/");
    const image = {
      url: `${req.protocol}://${req.get("host")}/${filePath}`,
      public_id: "" // To be updated if using Cloudinary
    };


    // create subcategories
    // const createdSubs = await SubCategories.insertMany(
    //   subCategories.map((item) => ({
    //     name: item.name.trim()
    //   }))
    // );

    // const subIds = createdSubs.map((sub) => sub._id);

    const subCategory = await SubCategories.create({
      name: subCategories_Name.trim(),
      description: subCategories_Description.trim(),
      category_Id: category_Id,
      image
    });

    const createdSubCategory = await SubCategories.findById(subCategory._id)
      .populate("category_Id", "name")
      .select("-__v -updatedAt");

    return res.status(201).json(
      new ApiResponse(201, createdSubCategory, "Subcategory created successfully")
    );

  } catch (error) {
    console.log("error in create subcategories:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

async function getSubCategories(req, res) {
  try {
    const subCategories = await SubCategories.find({
      deletedAt: null
    })
    .populate({
        path: "category_Id",
        match: { deletedAt: null },
        select: "name"
      })
      .select("-__v -updatedAt");


    return res.status(200).json(
      new ApiResponse(200, subCategories, "Subcategories fetched successfully")
    );

  } catch (error) {
    console.log("error in get subcategories:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message
    });
  }
}

async function getSubCategoryById(req, res) {
  try {
    const { id } = req.params;

    const subCategory = await SubCategories.findOne({
      _id: id,
      deletedAt: null
    })
    .populate("category_Id", "name")
      .select("-__v -updatedAt");

    if (!subCategory) {
      throw new ApiError(404, "No subcategory found with this id");
    }

    return res.status(200).json(
      new ApiResponse(200, category, "Category fetched successfully")
    );

  } catch (error) {
    console.log("error in get category by id:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { subCategories_Name, subCategories_Description } = req.body;

    // validate subcategory id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid subcategory id");
    }

    const subCategory = await SubCategories.findById(id);

    if (!subCategory || subCategory.deletedAt !== null) {
      throw new ApiError(404, "No subcategory found with this id");
    }

    // update subcategory name
    if (subCategories_Name?.trim()) {
      subCategory.name = subCategories_Name.trim();
    }

    if (subCategories_Description?.trim()) {
      subCategory.description = subCategories_Description.trim();
    }

    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (file) {
          const filePath = file.path.replace(/\\/g, "/");
          updateData.image = {
            url: `${req.protocol}://${req.get("host")}/${filePath}`,
            public_id: "" // To be updated if using Cloudinary
          };
        }


        await subCategory.save();

    const updatedSubCategory = await SubCategories.findById(id)
      .select("-__v -updatedAt");

    return res.status(200).json(
      new ApiResponse(200, updatedSubCategory, "Subcategory updated successfully")
    );

  } catch (error) {
    console.log("error in update subcategory:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid subcategory id");
    }

    const subCategory = await SubCategories.findById(id);

    if (!subCategory || subCategory.deletedAt !== null) {
      throw new ApiError(404, "No subcategory found with this id");
    }

    // soft delete subcategory
    subCategory.deletedAt = new Date();
    await subCategory.save();

    // optional: soft delete all subcategories too
    // await SubCategories.updateMany(
    //   { _id: { $in: category.subCategories } },
    //   { deletedAt: new Date() }
    // );

    return res.status(200).json(
      new ApiResponse(200, null, "Subcategory deleted successfully")
    );

  } catch (error) {
    console.log("error in delete subcategory:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

export {
    CreateSubCategories,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
}