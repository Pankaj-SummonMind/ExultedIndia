// routes/AboutUs.routes.js

import express from "express";


import { upload } from "../middlewares/multer.middleware.js";
import { createAboutUs, getAboutUs, updateAboutUs } from "../controllers/aboutus.controllers.js";

const router = express.Router();

/* -----------------------------------------
   CREATE ABOUT US
----------------------------------------- */
router.post("/createAboutUs",upload.fields([
    { name: "heroImages", maxCount: 3 },

    { name: "overviewImage", maxCount: 1 },

    { name: "missionImage", maxCount: 1 },

    { name: "researchImage", maxCount: 1 },

    { name: "visionImage", maxCount: 1 },
  ]),
  createAboutUs
);
router.get("/getAboutUs",getAboutUs);
router.put("/updateAboutUs",
  upload.fields([
    { name: "heroImages", maxCount: 3 },

    { name: "overviewImage", maxCount: 1 },

    { name: "missionImage", maxCount: 1 },

    { name: "researchImage", maxCount: 1 },

    { name: "visionImage", maxCount: 1 },
  ]),
  updateAboutUs
);

export default router;