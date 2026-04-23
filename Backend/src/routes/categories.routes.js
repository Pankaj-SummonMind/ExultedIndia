import {Router} from "express"
import { createCategories, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categories.controllers.js" 
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();


router.post("/createCategories",upload.single("image"),createCategories);
router.get("/getCategories",getCategories);
router.put("/:id",upload.single("image"),updateCategory);
router.delete("/:id",deleteCategory);
router.get("/:id",getCategoryById);

export default router;