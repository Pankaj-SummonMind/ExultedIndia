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

async function getAllProducts(req, res) {
  try {
    const products = await Product.find()
      .populate("product_category", "category_name")
      .populate("product_subCategory", "sub_category_name");

    return res.status(200).json(
      new ApiResponse(200, products, "Products fetched successfully")
    );
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success: error.success,
      message: error.message
    });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("product_category", "category_name")
      .populate("product_subCategory", "sub_category_name");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, product, "Product fetched successfully")
    );
  } catch (error) {
    console.error("Get Product by ID Error:", error);
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success: error.success,
      message: error.message
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, product, "Product updated successfully")
    );
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success: error.success,
      message: error.message
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, product, "Product deleted successfully")
    );
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      success: error.success,
      message: error.message
    });
  }
}

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};  
