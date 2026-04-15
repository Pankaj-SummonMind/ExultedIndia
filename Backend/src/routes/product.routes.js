import { Router } from "express";
import { createProduct } from "../controllers/product.controllers.js";

const router = Router()

router.post("/createProduct",createProduct)

export default router;