import { Router } from "express";
import { createProduct } from "../controllers/product.controllers.js";

const router = Router()

router.post("/createProduct",createProduct)
router.get("/getProduct",createProduct)
router.patch("/updateProduct",createProduct)
router.delete("/deleteProduct",createProduct)
router.get("/getProductById",createProduct)

export default router;