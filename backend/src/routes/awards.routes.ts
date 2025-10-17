import { Router } from "express";
import { getVendorReplyItems } from "../controllers/awards.controller";

const router = Router();

// GET /api/awards
router.get("/getVendorReplyItems/:rfqId/:token", getVendorReplyItems);

export default router;
