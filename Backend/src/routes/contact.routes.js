import Router from "express"
import { createContact, getContacts, updateContact } from "../controllers/contact.controllers.js"



const router = Router()


router.post("/createContact",createContact)
router.get("/getContacts",getContacts)
router.put("/updateContact/:id",updateContact)

export default router;