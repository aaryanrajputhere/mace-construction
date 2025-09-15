import express from "express";
import {
  getVendors,
  handleVendorReply,
  getItems
} from "../controllers/vendors.controller";

const router = express.Router();

router.get("/", getVendors);

router.get("/vendor-reply/:rfqId/:token", getItems);

// Vendor submits reply (POST)
router.post("/vendor-reply/:rfqId/:token", handleVendorReply);

export default router;
