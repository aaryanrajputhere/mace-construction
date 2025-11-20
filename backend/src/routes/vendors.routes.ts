import express from "express";
import multer from "multer";
import {
  getAllVendors,
  createVendor,
  deleteVendor,
  handleVendorReply,
  getItems,
} from "../controllers/vendors.controller";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
});

const router = express.Router();

router.get("/", getAllVendors);
router.post("/", createVendor);
router.delete("/:vendorId", deleteVendor);

// Get items for a specific RFQ (GET)
router.get("/get-items/:rfqId/:token", getItems);

// Vendor submits reply (POST) with file upload support
router.post("/vendor-reply/:rfqId/:token", upload.any(), handleVendorReply);

export default router;
