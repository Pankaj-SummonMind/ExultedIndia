import mongoose, { Schema } from "mongoose";

const socialMediaSchema = new Schema(
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
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);
export default SocialMedia;