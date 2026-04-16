import {Router} from "express"
import { createCategories } from "../controllers/categories.controllers.js" 

const router = Router();


router.post("/createCategories",createCategories);
router.get("/getCategories",createCategories);
router.patch("/updateCategories",createCategories);
router.delete("/deleteCategories",createCategories);
router.get("/getCategoriesById",createCategories);

export default router;