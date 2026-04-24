import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import Product from "../models/products.models.js";
import Categories from "../models/categories.modal.js";
import SubCategories from "../models/subCategories.modal.js";
import mongoose from "mongoose";


const createProduct = async (req, res) => {
  try {
    let {
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
    const images = req.files
  ? req.files.map(file => {
      const filePath = file.path.replace(/\\/g, "/");

      return {
        url: `${req.protocol}://${req.get("host")}/${filePath}`,
        public_id: ""
      };
    })
  : [];

    console.log("Image URLs:", images);

    // validations
    const categoryExists = await Categories.findById(product_category);
    if (!categoryExists) throw new ApiError(404, "Category not found");

    const subCategoryExists = await SubCategories.findById(product_subCategory);
    if (!subCategoryExists) throw new ApiError(404, "Subcategory not found");

    if (!specifications) {
  specifications = [];
    } else if (!Array.isArray(specifications)) {
      specifications = [specifications];
    }

    specifications = specifications.map(item =>
      typeof item === "string"
        ? JSON.parse(item)
        : item
    );

    // create product
    const product = await Product.create({
      product_name,
      product_category,
      product_subCategory,
      description,
      features: features || [],
      specifications: specifications || [],
      images: images
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

    console.log("products: ",products)

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
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid product id");
    }

    let {
      product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,
    } = req.body;

    // validations only if values sent
    if (product_category) {
      const categoryExists = await Categories.findById(product_category);
      if (!categoryExists) {
        throw new ApiError(404, "Category not found");
      }
    }

    if (product_subCategory) {
      const subCategoryExists =
        await SubCategories.findById(product_subCategory);

      if (!subCategoryExists) {
        throw new ApiError(404, "Subcategory not found");
      }
    }

    // normalize features
    if (!features) {
      features = [];
    } else if (!Array.isArray(features)) {
      features = [features];
    }

    // normalize specifications
    if (!specifications) {
      specifications = [];
    } else if (!Array.isArray(specifications)) {
      specifications = [specifications];
    }

    specifications = specifications.map(item =>
      typeof item === "string" ? JSON.parse(item) : item
    );

    // uploaded files
    const images = req.files
      ? req.files.map((file) => {
          const filePath = file.path.replace(/\\/g, "/");

          return {
            url: `${req.protocol}://${req.get("host")}/${filePath}`,
            public_id: "",
          };
        })
      : [];

    console.log("Image URLs:", images);

    const updateData = {
      product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,
    };

    if (images) {
      updateData.images = images;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
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
