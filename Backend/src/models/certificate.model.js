import mongoose, { Schema } from "mongoose";

const certificateSchema = new Schema(
  {
    certificate_name: {
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
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
