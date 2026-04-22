// routes/HomePage.routes.js

import express from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { createHomePage, getHomePage, updateHomePage } from "../controllers/HomeScreen.Controllers.js";


const router = express.Router();
router.post(
  "/createHomePage",upload.fields([{ name: "heroImage", maxCount: 1 },{ name: "heroDetailImage", maxCount: 1 },
  ]),
  createHomePage
);
router.get("/getHomePage",getHomePage);
router.put("/updateHomePage",upload.fields([{ name: "heroImage", maxCount: 1 },{ name: "heroDetailImage", maxCount: 1 },
  ]),
  updateHomePage
);

export default router;