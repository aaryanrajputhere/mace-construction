import express from "express";
import { handleVendorReply, getItems } from "../controllers/vendors.controller";

const router = express.Router();

router.get("/get-items/:rfqId/:token", getItems);

// Vendor submits reply (POST)
router.post("/vendor-reply/:rfqId/:token", handleVendorReply);

export default router;
