import {ApiError} from "../utils.js/ApiError.js"
import {ApiResponse} from "../utils.js/ApiResponse.js"
import Categories from "../models/categories.modal.js"
import SubCategories from "../models/subCategories.modal.js"
import mongoose from "mongoose"


async function createCategories(req, res) {
  try {
    const { categories_name, categories_description, } = req.body;
    console.log("req.body in create category: ", req.body);
    if (!categories_name || !categories_description) {
      throw new ApiError(400, "Category and Description are required");
    }

    const exists = await Categories.findOne({
      categories_name: categories_name.trim().toLowerCase(),
      deletedAt: null
    });
    console.log("existing category with same name:", exists);

    if (exists) {
      throw new ApiError(400, "Category with this name already exists");
    }

    // Since a certificate only has one image in the schema `image: { url, public_id }`
    // We expect exactly one file.
    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    
    if (!file) {
      throw new ApiError(400, "Category image is required");
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

    const existing = await Categories.findOne({
      categories_name: categories_name.trim(),
      deletedAt:null
      });

      if(existing){
      throw new ApiError(400,"Category already exists");
      }

    const category = await Categories.create({
      categories_name: categories_name.trim(),
      categories_description: categories_description.trim(),
      image
    });

    // const createdCategory = await Categories.findById(category._id)
    //   .populate("subCategories", "name")
    //   .select("-__v -updatedAt");

    return res.status(201).json(
      new ApiResponse(201, category, "Category created successfully")
    );

  } catch (error) {
    console.log("error in create categories:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Categories.find({
      deletedAt: null
    })
      .select("-__v ");

    if (categories.length === 0) {
      throw new ApiError(404, "No categories found");
    }

    return res.status(200).json(
      new ApiResponse(200, categories, "Categories fetched successfully")
    );

  } catch (error) {
    console.log("error in get categories:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message
    });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid category id");
    }

    const category = await Categories.findOne({
      _id: id,
      deletedAt: null
    })
      .select("-__v -updatedAt");

    if (!category) {
      throw new ApiError(404, "No category found with this id");
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

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { categories_name, categories_description } = req.body;
    console.log("req.body in update category: ", categories_name, categories_description , id);

    // validate category id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid category id");
    }

    const category = await Categories.findById(id);

    if (!category || category.deletedAt !== null) {
      throw new ApiError(404, "No category found with this id");
    }

    // update category name
    if (categories_name?.trim()) {
      category.categories_name = categories_name.trim();
    }

    if (categories_description?.trim()) {
      category.categories_description = categories_description.trim();
    }

    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (file) {
          const filePath = file.path.replace(/\\/g, "/");
          category.image = {
            url: `${req.protocol}://${req.get("host")}/${filePath}`,
            public_id: "" // To be updated if using Cloudinary
          };
        }


        await category.save();

    const updatedCategory = await Categories.findById(id)
      .select("-__v -updatedAt");

    return res.status(200).json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );

  } catch (error) {
    console.log("error in update category:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid category id");
    }

    const category = await Categories.findById(id);

    if (!category || category.deletedAt !== null) {
      throw new ApiError(404, "No category found with this id");
    }

    // soft delete category
    category.deletedAt = new Date();
    await category.save();

    // optional: soft delete all subcategories too
    // await SubCategories.updateMany(
    //   { _id: { $in: category.subCategories } },
    //   { deletedAt: new Date() }
    // );

    return res.status(200).json(
      new ApiResponse(200, null, "Category deleted successfully")
    );

  } catch (error) {
    console.log("error in delete category:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

export {
    createCategories,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}