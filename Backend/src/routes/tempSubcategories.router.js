import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js";
import { createdSubCategory, deleteSubCategory, getSubCategories, getSubCategoryById, updateSubCategory } from "../controllers/tempSubcategory.controllers.js";
const router = Router();


router.post("/createSubCategories",upload.single("image"),createdSubCategory);
router.get("/getSubCategories",getSubCategories);
router.put("/:id",upload.single("image"),updateSubCategory);
router.delete("/:id",deleteSubCategory);
router.get("/:id",getSubCategoryById);

export default router;