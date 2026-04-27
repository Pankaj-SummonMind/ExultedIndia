import Contact from "../models/contact.model.js";
import { ApiResponse } from "../utils.js/ApiResponse.js";
import { ApiError } from "../utils.js/ApiError.js";

/* ---------------- CREATE CONTACT ---------------- */
 const createContact = async (req, res) => {
  try {
    const {
      mapLocation,
      phoneNumber,
      whatappNumber,
      email,
      heading,
      detail,
      address,
    } = req.body;

    if (
      !mapLocation ||
      !phoneNumber ||
      !whatappNumber ||
      !email ||
      !heading ||
      !detail ||
      !address
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const contact = await Contact.create({
      mapLocation,
      phoneNumber,
      whatappNumber,
      email,
      heading,
      detail,
      address,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, contact, "Contact created successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/* ---------------- GET ALL CONTACTS ---------------- */
 const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findOne({ deletedAt: null })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res
      .status(200)
      .json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


/* ---------------- UPDATE CONTACT ---------------- */
 const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, deletedAt: null },
      req.body,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedContact) {
      throw new ApiError(404, "Contact not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedContact, "Contact updated successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export {
    createContact,
    getContacts,
    updateContact
}