import {Router} from "express"
import { createCategories } from "../controllers/categories.controllers.js" 

const router = Router();


router.post("/createCategories",createCategories);


export default router;