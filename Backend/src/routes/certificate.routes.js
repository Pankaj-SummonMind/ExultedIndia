import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createCertificate, deleteCertificate, getAllCertificates, getCertificateById, updateCertificate } from "../controllers/certificate.controllers.js";

const router = Router()

router.post("/createCertificate",upload.single("image"),createCertificate)
router.get("/getAllCertificates",getAllCertificates)
router.get("/getCertificate",getCertificateById)
router.put("/updateCertificate",upload.single("image"),updateCertificate)
router.delete("/deleteCertificate",deleteCertificate)

export default router;