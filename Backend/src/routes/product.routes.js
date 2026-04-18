import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.post("/createProduct",upload.array("images",5),createProduct)
router.get("/getProduct",getAllProducts)
router.put("/:id",upload.array("images",5),updateProduct)
router.delete("/:id",deleteProduct)
router.get("/:id",getProductById)

export default router;