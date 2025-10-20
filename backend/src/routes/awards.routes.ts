import { Router } from "express";
import {
  awardItem,
  getVendorReplyItems,
} from "../controllers/awards.controller";

const router = Router();

// Awards routes
// GET vendor replies (used by award UI)
router.get("/getVendorReplyItems/:rfq_id/:token", getVendorReplyItems);
// POST to award a specific item (frontend sends item_name + vendor_name in body)
router.post("/awardItem/:rfq_id/:token", awardItem);

export default router;
