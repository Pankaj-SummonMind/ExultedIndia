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
      ref: "Category",
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

    // ✅ Multiple features (simple list)
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // ✅ Specifications (key-value pairs)
    specifications: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],

    // ✅ Multiple images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: String, // (for cloudinary or storage)
      },
    ],

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product ;