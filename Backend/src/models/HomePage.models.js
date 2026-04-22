import mongoose from "mongoose";

const { Schema } = mongoose;

/* ---------------- COMMON ---------------- */

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

/* ---------------- HERO ---------------- */

const heroSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    subTitle: {
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

/* ---------------- HERO DETAIL ---------------- */

const heroDetailSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    stats: [
      {
        label: {
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
    ],
    image: imageSchema,
  },
  { _id: false }
);

/* ---------------- HOME CATEGORY ---------------- */

const homeCategorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
  },
  { _id: false }
);

/* ---------------- WHY CHOOSE US ---------------- */

const whyChooseUsSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    points: [
      {
        label: {
          type: String,
          trim: true,
          default: "",
        },
        detail: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],
  },
  { _id: false }
);

/* ---------------- LOCATIONS ---------------- */

const locationSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    detail: {
      type: String,
      trim: true,
      default: "",
    },
    locations: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
);

/* ---------------- TESTIMONIAL ---------------- */

const testimonialSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

/* ---------------- JOIN US ---------------- */

const joinUsSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    detail: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

/* ---------------- MAIN MODEL ---------------- */

const homePageSchema = new Schema(
  {
    hero: heroSchema,

    heroDetail: heroDetailSchema,

    homeCategory: homeCategorySchema,

    whyChooseUs: whyChooseUsSchema,

    locations: locationSchema,

    testimonials: [testimonialSchema],

    joinUs: joinUsSchema,
  },
  {
    timestamps: true,
  }
);

export const HomePage = mongoose.model("HomePage", homePageSchema);