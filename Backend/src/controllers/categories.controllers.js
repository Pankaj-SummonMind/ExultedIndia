import {ApiError} from "../utils.js/ApiError.js"
import {ApiResponse} from "../utils.js/ApiResponse.js"
import Categories from "../models/categories.modal.js"
import SubCategories from "../models/subCategories.modal.js"
import mongoose from "mongoose"


async function createCategories(req, res) {
  try {
    const { categories_name, subCategories } = req.body;

    if (!categories_name || !subCategories?.length) {
      throw new ApiError(400, "Category and SubCategory are required");
    }

    // create subcategories
    const createdSubs = await SubCategories.insertMany(
      subCategories.map((item) => ({
        name: item.name.trim()
      }))
    );

    const subIds = createdSubs.map((sub) => sub._id);

    const category = await Categories.create({
      categories_name: categories_name.trim(),
      subCategories: subIds
    });

    const createdCategory = await Categories.findById(category._id)
      .populate("subCategories", "name")
      .select("-__v -updatedAt");

    return res.status(201).json(
      new ApiResponse(201, createdCategory, "Category created successfully")
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
      .populate({
        path: "subCategories",
        match: { deletedAt: null }, // optional for subcategories too
        select: "name"
      })
      .select("-__v -updatedAt");

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

    const category = await Categories.findOne({
      _id: id,
      deletedAt: null
    })
      .populate("subCategories", "name")
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
    const { categories_name, subCategories } = req.body;

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

    let finalSubIds = [];

    if (Array.isArray(subCategories)) {
      for (const item of subCategories) {
        const name = item?.name?.trim();

        if (!name) continue;

        if (item._id && mongoose.Types.ObjectId.isValid(item._id)) {
          // update existing
          await SubCategories.findByIdAndUpdate(item._id, {
            name
          });

          finalSubIds.push(item._id);

        } else {
          // create new
          const newSub = await SubCategories.create({
            name
          });

          finalSubIds.push(newSub._id);
        }
      }

      // optional: delete removed old refs
      const removedIds = category.subCategories.filter(
        (oldId) => !finalSubIds.some((newId) => newId.toString() === oldId.toString())
      );

      if (removedIds.length > 0) {
        await SubCategories.updateMany(
          { _id: { $in: removedIds } },
          { deletedAt: new Date() }
        );
      }

      category.subCategories = finalSubIds;
    }

    await category.save();

    const updatedCategory = await Categories.findById(id)
      .populate({
        path: "subCategories",
        match: { deletedAt: null },
        select: "name"
      })
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
    await SubCategories.updateMany(
      { _id: { $in: category.subCategories } },
      { deletedAt: new Date() }
    );

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