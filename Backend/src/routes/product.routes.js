import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// create product (images + pdf)
router.post(
  "/createProduct",
  (req, res, next) => {
    upload.fields([
      { name: "images", maxCount: 5 },
      { name: "pdf", maxCount: 1 },
    ])(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  },
  createProduct
);

// get all
router.get("/getProduct", getAllProducts);

// update product (images + pdf optional)
router.put(
  "/:id",
  (req, res, next) => {
    upload.fields([
      { name: "images", maxCount: 5 },
      { name: "pdf", maxCount: 1 },
    ])(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  },
  updateProduct
);

// delete
router.delete("/:id", deleteProduct);

// get by id
router.get("/:id", getProductById);

export default router;
