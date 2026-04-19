import { Router } from "express";
import { createSocialMedia,getAllSocialMedia,getSocialMediaById,deleteSocialMedia, updateSocialMedia } from "../controllers/socialMedia.controllers.js";

const router = Router()

router.post("/createSocialMedia",createSocialMedia)
router.get("/getAllSocialMedia",getAllSocialMedia)
router.put("/:id",updateSocialMedia)
router.delete("/:id",deleteSocialMedia)
router.get("/:id",getSocialMediaById)

export default router;