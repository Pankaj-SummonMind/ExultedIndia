import mongoose,{Schema} from "mongoose";

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category_Id: {
    type: Schema.Types.ObjectId,
    ref: "Categories", // 👈 link to category model
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String, // (for cloudinary or storage)
      // required: true,
    },
  },

  deletedAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true }); // 👈 add this

const SubCategories = mongoose.model("SubCategories",subCategorySchema)
export default SubCategories;