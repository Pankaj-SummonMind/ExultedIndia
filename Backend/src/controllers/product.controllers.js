import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import Product from "../models/products.models.js";
import Categories from "../models/categories.modal.js";
import SubCategories from "../models/subCategories.modal.js";
import mongoose from "mongoose";


const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,
    } = req.body;

    console.log(product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,)
    if (!product_name || !product_category || !product_subCategory) {
      throw new ApiError(400, "Required fields missing");
    }

    // uploaded files
    const imageUrls = req.files
      ? req.files.map(file => {
          const filePath = file.path.replace(/\\/g, "/");
          return `${req.protocol}://${req.get("host")}/${filePath}`;
        })
      : [];

    console.log("Image URLs:", imageUrls);

    // validations
    const categoryExists = await Categories.findById(product_category);
    if (!categoryExists) throw new ApiError(404, "Category not found");

    const subCategoryExists = await SubCategories.findById(product_subCategory);
    if (!subCategoryExists) throw new ApiError(404, "Subcategory not found");

    // create product
    const product = await Product.create({
      product_name,
      product_category,
      product_subCategory,
      description,
      features: features || [],
      specifications: specifications || [],
      images: imageUrls
    });

    return res.status(201).json(
      new ApiResponse(201, product, "Product created successfully")
    );

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

async function getAllProducts(req, res) {
  try {
    const products = await Product.find({
      deletedAt: null
    })    
      .populate("product_category", "categories_name")
      .populate("product_subCategory", "name")
      .select("-__v -updatedAt");

    return res.status(200).json(
      new ApiResponse(200, products, "Products fetched successfully")
    );

  } catch (error) {
    console.error("Get All Products Error:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}


async function getProductById(req, res) {
  console.log("get prduct by id function caLLED")
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product id");
    }

    const product = await Product.findById(id)
      .populate("product_category", "categories_name")
      .populate("product_subCategory", "name");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, product, "Product fetched successfully")
    );

  } catch (error) {
    console.error("Get Product By Id Error:", error);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

async function updateProduct(req, res) {
  console.log("update function called")
  try {
    const { id } = req.params;
    let {
          product_name,
          product_category,
          product_subCategory,
          description,
          features,
          specifications,
        } = req.body;
    console.log("product detail in backend ",id,req.body)

    const imageLocalPath = req.file?.path
    // console.log("user Detail : ",req.body,"image path:",req.file?.path);
    const filePath = imageLocalPath?.replace(/\\/g, "/"); 
    console.log("filePath:",filePath);
    let imageUrl;
  
    if(filePath){
       imageUrl = `${req.protocol}://${req.get("host")}/${filePath}`
    }
    console.log(imageUrl);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product id");
    }

    if (!Object.keys(req.body).length) {
      throw new ApiError(400, "No update data provided");
    }

    if(!product_name && !product_category && !product_subCategory ){
      throw new ApiError(400,"All Fields are required")
    }

    const product = await Product.findByIdAndUpdate(
      id,
        {
        $set:{
          product_name: product_name,
          product_category : product_category,
          product_subCategory : product_subCategory,
          description : description,
          features : features,
          specifications : specifications,
          images : imageUrl
        }
      },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, product, "Product updated successfully")
    );

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product id");
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { returnDocument: "after", }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Product deleted successfully")
    );

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
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
