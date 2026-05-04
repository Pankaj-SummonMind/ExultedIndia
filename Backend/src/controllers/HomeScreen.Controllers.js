// controllers/HomePage.controller.js

import mongoose from "mongoose";
import { HomePage } from "../models/HomePage.models.js";
import Categories from "../models/categories.modal.js";
import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";

/* ----------------------------------------
   CREATE HOMEPAGE
---------------------------------------- */
const createHomePage = async (req, res) => {

  try {
    const {
      hero,
      heroDetail,
      homeCategory,
      whyChooseUs,
      locations,
      testimonials,
      joinUs,
    } = req.body;

    const alreadyExist = await HomePage.findOne();

    if (alreadyExist) {
      throw new ApiError(400, "HomePage already exists, use update");
    }

    let heroImage = {};
    let heroDetailImage = {};

    if (req.files?.heroImage?.[0]) {
      const file = req.files.heroImage[0];
      const filePath = file.path.replace(/\\/g, "/");

      heroImage = {
        url: `${req.protocol}://${req.get("host")}/${filePath}`,
        public_id: "",
      };
    }

    if (req.files?.heroDetailImage?.[0]) {
      const file = req.files.heroDetailImage[0];
      const filePath = file.path.replace(/\\/g, "/");

      heroDetailImage = {
        url: `${req.protocol}://${req.get("host")}/${filePath}`,
        public_id: "",
      };
    }

    const created = await HomePage.create({
      hero: {
        ...JSON.parse(hero || "{}"),
        image: heroImage,
      },

      heroDetail: {
        ...JSON.parse(heroDetail || "{}"),
        image: heroDetailImage,
      },

      homeCategory: homeCategory
        ? JSON.parse(homeCategory)
        : {},

      whyChooseUs: whyChooseUs
        ? JSON.parse(whyChooseUs)
        : {},

      locations: locations
        ? JSON.parse(locations)
        : {},

      testimonials: testimonials
        ? JSON.parse(testimonials)
        : [],

      joinUs: joinUs
        ? JSON.parse(joinUs)
        : {},
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        created,
        "HomePage created successfully"
      )
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------------------
   GET HOMEPAGE
---------------------------------------- */
const getHomePage = async (req, res) => {
  try {
    const data = await HomePage.findOne().populate(
      "homeCategory.categories"
    );

    if (!data) {
      throw new ApiError(404, "HomePage not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        data,
        "HomePage fetched successfully"
      )
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------------------
   UPDATE HOMEPAGE
---------------------------------------- */
const updateHomePage = async (req, res) => {
  try {
    const existing = await HomePage.findOne();

    if (!existing) {
      throw new ApiError(404, "HomePage not found");
    }

    const {
      hero,
      heroDetail,
      homeCategory,
      whyChooseUs,
      locations,
      testimonials,
      joinUs,
    } = req.body;

    if (hero) {
      existing.hero = {
        ...existing.hero.toObject(),
        ...JSON.parse(hero),
      };
    }

    if (heroDetail) {
      existing.heroDetail = {
        ...existing.heroDetail.toObject(),
        ...JSON.parse(heroDetail),
      };
    }

    if (homeCategory) {
      existing.homeCategory = JSON.parse(homeCategory);
    }

    if (whyChooseUs) {
      existing.whyChooseUs = JSON.parse(whyChooseUs);
    }

    if (locations) {
      existing.locations = JSON.parse(locations);
    }

    if (testimonials) {
      existing.testimonials = JSON.parse(testimonials);
    }

    if (joinUs) {
      existing.joinUs = JSON.parse(joinUs);
    }

    // hero image
    if (req.files?.heroImage?.[0]) {
      const file = req.files.heroImage[0];
      const filePath = file.path.replace(/\\/g, "/");

      existing.hero.image = {
        url: `${req.protocol}://${req.get("host")}/${filePath}`,
        public_id: "",
      };
    }

    // hero detail image
    if (req.files?.heroDetailImage?.[0]) {
      const file = req.files.heroDetailImage[0];
      const filePath = file.path.replace(/\\/g, "/");

      existing.heroDetail.image = {
        url: `${req.protocol}://${req.get("host")}/${filePath}`,
        public_id: "",
      };
    }

    await existing.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        existing,
        "HomePage updated successfully"
      )
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createHomePage,
  getHomePage,
  updateHomePage,
};