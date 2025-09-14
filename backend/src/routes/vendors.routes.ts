import express from "express";
import {
  getVendors,
  handleVendorReply,
} from "../controllers/vendors.controller";

const router = express.Router();

router.get("/", getVendors);

// Vendor submits reply (POST)
router.post("/vendor-reply/:rfqId/:token", handleVendorReply);

export default router;
