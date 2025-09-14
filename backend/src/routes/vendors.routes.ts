import express from "express";
import { handleVendorReply } from "../controllers/vendors.controller";

const router = express.Router();

router.get('/vendors' , );

// Vendor submits reply (POST)
router.post("/vendor-reply/:rfqId/:token", handleVendorReply);

export default router;
