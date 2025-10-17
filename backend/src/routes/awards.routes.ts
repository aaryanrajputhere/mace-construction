import { Router } from "express";
import {
  awardItem,
  getVendorReplyItems,
} from "../controllers/awards.controller";

const router = Router();

// GET /api/awards
router.get("/getVendorReplyItems/:rfqId/:token", getVendorReplyItems);
router.get("/awardItem/:rfqId/:token", awardItem);

export default router;
