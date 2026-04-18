import {Router} from "express"
import { createCategories, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categories.controllers.js" 
const router = Router();


router.post("/createCategories",createCategories);
router.get("/getCategories",getCategories);
router.put("/:id",updateCategory);
router.delete("/:id",deleteCategory);
router.get("/:id",getCategoryById);

export default router;