// controllers/AboutUs.controller.js

import { AboutUs } from "../models/aboutus.model.js";
import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";

/* ---------------------------------------
   IMAGE BUILDER
--------------------------------------- */
const buildImage = (file, req) => {
  const filePath = file.path.replace(/\\/g, "/");

  return {
    url: `${req.protocol}://${req.get("host")}/${filePath}`,
    public_id: "",
  };
};

/* ---------------------------------------
   CREATE ABOUT US
--------------------------------------- */
const createAboutUs = async (req, res) => {
  try {
    const alreadyExist = await AboutUs.findOne();

    if (alreadyExist) {
      throw new ApiError(400, "AboutUs already exists, use update");
    }

    const {
      hero,
      companyOverview,
      mission,
      research,
      vision,
      companyStats,
    } = req.body;

    // Hero images max 3
    let heroImages = [];

    if (req.files?.heroImages) {
      heroImages = req.files.heroImages.map((file) =>
        buildImage(file, req)
      );
    }

    if (heroImages.length > 3) {
      throw new ApiError(400, "Hero images max limit is 3");
    }

    const created = await AboutUs.create({
      hero: {
        ...JSON.parse(hero || "{}"),
        images: heroImages,
      },

      companyOverview: {
        ...JSON.parse(companyOverview || "{}"),
        image: req.files?.overviewImage?.[0]
          ? buildImage(req.files.overviewImage[0], req)
          : {},
      },

      mission: {
        ...JSON.parse(mission || "{}"),
        image: req.files?.missionImage?.[0]
          ? buildImage(req.files.missionImage[0], req)
          : {},
      },

      research: {
        ...JSON.parse(research || "{}"),
        image: req.files?.researchImage?.[0]
          ? buildImage(req.files.researchImage[0], req)
          : {},
      },

      vision: {
        ...JSON.parse(vision || "{}"),
        image: req.files?.visionImage?.[0]
          ? buildImage(req.files.visionImage[0], req)
          : {},
      },

      companyStats: companyStats
        ? JSON.parse(companyStats)
        : [],
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        created,
        "AboutUs created successfully"
      )
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------------------------------
   GET ABOUT US
--------------------------------------- */
const getAboutUs = async (req, res) => {
  try {
    const data = await AboutUs.findOne();

    if (!data) {
      throw new ApiError(404, "AboutUs not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        data,
        "AboutUs fetched successfully"
      )
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------------------------------
   UPDATE ABOUT US
--------------------------------------- */
const updateAboutUs = async (req, res) => {
  try {
    const existing = await AboutUs.findOne();

    if (!existing) {
      throw new ApiError(404, "AboutUs not found");
    }

    const {
      hero,
      companyOverview,
      mission,
      research,
      vision,
      companyStats,
    } = req.body;

    /* hero */
    if (hero) {
      existing.hero = {
        ...existing.hero.toObject(),
        ...JSON.parse(hero),
      };
    }

    if (req.files?.heroImages) {
      const heroImages = req.files.heroImages.map((file) =>
        buildImage(file, req)
      );

      existing.hero.images = heroImages;
    }

    /* overview */
    if (companyOverview) {
      existing.companyOverview = {
        ...existing.companyOverview.toObject(),
        ...JSON.parse(companyOverview),
      };
    }

    if (req.files?.overviewImage?.[0]) {
      existing.companyOverview.image =
        buildImage(req.files.overviewImage[0], req);
    }

    /* mission */
    if (mission) {
      existing.mission = {
        ...existing.mission.toObject(),
        ...JSON.parse(mission),
      };
    }

    if (req.files?.missionImage?.[0]) {
      existing.mission.image =
        buildImage(req.files.missionImage[0], req);
    }

    /* research */
    if (research) {
      existing.research = {
        ...existing.research.toObject(),
        ...JSON.parse(research),
      };
    }

    if (req.files?.researchImage?.[0]) {
      existing.research.image =
        buildImage(req.files.researchImage[0], req);
    }

    /* vision */
    if (vision) {
      existing.vision = {
        ...existing.vision.toObject(),
        ...JSON.parse(vision),
      };
    }

    if (req.files?.visionImage?.[0]) {
      existing.vision.image =
        buildImage(req.files.visionImage[0], req);
    }

    /* stats */
    if (companyStats) {
      existing.companyStats =
        JSON.parse(companyStats);
    }

    await existing.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        existing,
        "AboutUs updated successfully"
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
  createAboutUs,
  getAboutUs,
  updateAboutUs,
};