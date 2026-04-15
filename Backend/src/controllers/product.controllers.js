import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import Product from "../models/products.models.js";
import Categories from "../models/categories.modal.js";
import SubCategories from "../models/subCategories.modal.js";


export const createProduct = async (req, res,next) => {
  try {
    const {
      product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,
      images,
    } = req.body;

    if (!product_name || !product_category || !product_subCategory) {
      throw new ApiError(400,"Product name, category and subcategory are required")
    }

    //  2. Validate Category exists
    const categoryExists = await Categories.findById(product_category);
    if (!categoryExists) {
        throw new ApiError(404,"Category not found")
    }

    //  3. Validate SubCategory exists
    const subCategoryExists = await SubCategories.findById(product_subCategory);
    if (!subCategoryExists) {
      throw new ApiError(404,"Subcategory not found")
    }

    //  4. Validate specifications format
    if (specifications && !Array.isArray(specifications)) {
        throw new ApiError(400,"Specifications must be an array")
    }

    //  5. Create product
    const product = await Product.create({
      product_name,
      product_category,
      product_subCategory,
      description,
      features: features || [],
      specifications: specifications || [],
      images: images || [],
    });

    //  Success response
    throw new ApiResponse(201,product,"Product created sucessfully")


  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success : error.success,
      message: error.message
    })
  }
};