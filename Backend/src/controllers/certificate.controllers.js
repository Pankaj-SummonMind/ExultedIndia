import { ApiError } from "../utils.js/ApiError.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import Certificate from "../models/certificate.model.js";
import mongoose from "mongoose";

const createCertificate = async (req, res) => {
  try {
    let { certificate_name } = req.body;

    if (!certificate_name) {
      throw new ApiError(400, "Required fields missing");
    }

    // Since a certificate only has one image in the schema `image: { url, public_id }`
    // We expect exactly one file.
    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    
    if (!file) {
      throw new ApiError(400, "Certificate image is required");
    }

    const filePath = file.path.replace(/\\/g, "/");
    const image = {
      url: `${req.protocol}://${req.get("host")}/${filePath}`,
      public_id: "" // To be updated if using Cloudinary
    };

    // create certificate
    const certificate = await Certificate.create({
      certificate_name,
      image
    });

    return res.status(201).json(
      new ApiResponse(201, certificate, "Certificate created successfully")
    );

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

async function getAllCertificates(req, res) {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt");

    return res.status(200).json(
      new ApiResponse(200, certificates, "Certificates fetched successfully")
    );

  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Server Error"
    });
  }
}

async function getCertificateById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid certificate id");
    }

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      throw new ApiError(404, "Certificate not found");
    }

    return res.status(200).json(
      new ApiResponse(200, certificate, "Certificate fetched successfully")
    );

  } catch (error) {

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

async function updateCertificate(req, res) {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid certificate id");
    }

    let { certificate_name } = req.body;

    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    
    const updateData = {};
    if (certificate_name) {
      updateData.certificate_name = certificate_name;
    }

    if (file) {
      const filePath = file.path.replace(/\\/g, "/");
      updateData.image = {
        url: `${req.protocol}://${req.get("host")}/${filePath}`,
        public_id: "" // To be updated if using Cloudinary
      };
    }

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!certificate) {
      throw new ApiError(404, "Certificate not found");
    }

    return res.status(200).json({
      success: true,
      data: certificate,
      message: "Certificate updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteCertificate(req, res) {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid certificate id");
    }

    // Assuming hard delete for certificates since no deletedAt in schema.
    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate) {
      throw new ApiError(404, "Certificate not found");
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Certificate deleted successfully")
    );

  } catch (error) { 
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  } 
}

export {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate
};