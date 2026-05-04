import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js";
import { CreateSubCategories, deleteSubCategory, getSubCategories, getSubCategoryById, updateSubCategory } from "../controllers/subCategory.controllers.js";
const router = Router();


router.post("/createSubCategories",upload.single("image"),CreateSubCategories);
router.get("/getSubCategories",getSubCategories);
router.put("/:id",upload.single("image"),updateSubCategory);
router.delete("/:id",deleteSubCategory);
router.get("/:id",getSubCategoryById);

export default router;