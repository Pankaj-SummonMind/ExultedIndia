// models/AboutUs.models.js

import mongoose from "mongoose";

const { Schema } = mongoose;

/* -----------------------------------
   COMMON IMAGE SCHEMA
----------------------------------- */
const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

/* -----------------------------------
   HERO SECTION
   max 3 images
----------------------------------- */
const heroSchema = new Schema(
  {
    heading: {
      type: String,
      trim: true,
      default: "",
    },

    subHeading: {
      type: String,
      trim: true,
      default: "",
    },

    images: {
      type: [imageSchema],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "Hero images max limit is 3",
      },
      default: [],
    },
  },
  { _id: false }
);

/* -----------------------------------
   COMMON CONTENT SECTION
   (overview / mission / research / vision)
----------------------------------- */
const contentSectionSchema = new Schema(
  {
    heading: {
      type: String,
      trim: true,
      default: "",
    },

    subHeading: {
      type: String,
      trim: true,
      default: "",
    },

    detail: {
      type: String,
      trim: true,
      default: "",
    },

    image: imageSchema,
  },
  { _id: false }
);

/* -----------------------------------
   COMPANY STATS
----------------------------------- */
const statSchema = new Schema(
  {
    key: {
      type: String,
      trim: true,
      default: "",
    },

    value: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

/* -----------------------------------
   MAIN ABOUT US MODEL
----------------------------------- */
const aboutUsSchema = new Schema(
  {
    hero: heroSchema,

    companyOverview: contentSectionSchema,

    mission: contentSectionSchema,

    research: contentSectionSchema,

    vision: contentSectionSchema,

    companyStats: {
      type: [statSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const AboutUs = mongoose.model(
  "AboutUs",
  aboutUsSchema
);