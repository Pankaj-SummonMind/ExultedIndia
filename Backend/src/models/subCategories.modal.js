import mongoose,{Schema} from "mongoose";

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true }); // 👈 add this

const SubCategories = mongoose.model("SubCategories",subCategorySchema)
export default SubCategories;