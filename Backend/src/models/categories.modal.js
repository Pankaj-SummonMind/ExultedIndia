import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    categories_name: {
      type: String,
      required: true,
      trim: true,
    },

    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategories", // 👈 link to subcategory model
      },
    ],

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categories", categorySchema);
export default Categories;