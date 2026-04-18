import { Router } from "express";
import { getAllUsers, getUserById, registerUser } from "../controllers/users.controllers.js";

const router = Router() 

router.post("/registerUser",registerUser)
router.get("/getAllUsers",getAllUsers)
router.get("/:id",getUserById)


export default router;