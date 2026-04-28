import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },

    product_category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },

    product_subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategories",
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Multiple features
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // Specifications
    specifications: [
      {
        key: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // Multiple Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          default: "",
        },
      },
    ],

    // PDF File
    pdf: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      fileName: {
        type: String,
        default: "",
      },
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;