import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
{
  categories_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },

  categories_description: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      default: ""
    }
  },

  deletedAt: {
    type: Date,
    default: null
  }
},
{ timestamps: true }
);

export default mongoose.model("Categories", categorySchema);