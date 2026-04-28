import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import Product from "../models/products.models.js";
import Categories from "../models/categories.modal.js";
import SubCategories from "../models/subCategories.modal.js";
import mongoose from "mongoose";

const buildLocalFileUrl = (req, file) =>
  `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`;

const validatePdfFile = (file) => {
  if (file && file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Only PDF file is allowed");
  }
};

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

    if (!product_name || !product_category || !product_subCategory) {
      throw new ApiError(400, "Required fields missing");
    }

    // Images Upload (same old functionality)
    const images = req.files?.images
      ? req.files.images.map((file) => {
          return {
            url: buildLocalFileUrl(req, file),
            public_id: "",
          };
        })
      : [];

    validatePdfFile(req.files?.pdf?.[0]);

    // PDF Upload (new)
    const pdf = req.files?.pdf?.[0]
      ? {
          url: buildLocalFileUrl(req, req.files.pdf[0]),
          public_id: "",
          fileName: req.files.pdf[0].originalname,
        }
      : {
          url: "",
          public_id: "",
          fileName: "",
        };

    console.log("Received PDF file:", pdf);

    // validations
    const categoryExists = await Categories.findById(product_category);
    if (!categoryExists) throw new ApiError(404, "Category not found");

    const subCategoryExists = await SubCategories.findById(product_subCategory);
    if (!subCategoryExists) throw new ApiError(404, "Subcategory not found");

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

    specifications = specifications.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );

    const product = await Product.create({
      product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,
      images,
      pdf,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

async function getAllProducts(req, res) {
  try {
    const products = await Product.find({
      deletedAt: null,
    })
      .populate("product_category", "categories_name")
      .populate("product_subCategory", "name")
      .select("-__v -updatedAt");

    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getProductById(req, res) {
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

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
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

    if (product_category) {
      const categoryExists = await Categories.findById(product_category);
      if (!categoryExists) throw new ApiError(404, "Category not found");
    }

    if (product_subCategory) {
      const subCategoryExists =
        await SubCategories.findById(product_subCategory);

      if (!subCategoryExists) throw new ApiError(404, "Subcategory not found");
    }

    if (!features) {
      features = [];
    } else if (!Array.isArray(features)) {
      features = [features];
    }

    if (!specifications) {
      specifications = [];
    } else if (!Array.isArray(specifications)) {
      specifications = [specifications];
    }

    specifications = specifications.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );

    const images = req.files?.images
      ? req.files.images.map((file) => {
          return {
            url: buildLocalFileUrl(req, file),
            public_id: "",
          };
        })
      : [];

    const updateData = {
      product_name,
      product_category,
      product_subCategory,
      description,
      features,
      specifications,
    };

    if (images.length > 0) {
      updateData.images = images;
    }

    // PDF update
    if (req.files?.pdf?.[0]) {
      validatePdfFile(req.files.pdf[0]);

      updateData.pdf = {
        url: buildLocalFileUrl(req, req.files.pdf[0]),
        public_id: "",
        fileName: req.files.pdf[0].originalname,
      };
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
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
      { returnDocument: "after" }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
