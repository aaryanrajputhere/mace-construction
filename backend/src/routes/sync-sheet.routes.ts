import { Router } from "express";
import {
  syncMaterials,
  syncRFQs,
  syncVendors,
} from "../controllers/sync-sheet.controller";

const router = Router();

// POST /api/materials
router.post("/materials", syncMaterials);

// POST /api/vendors
router.post("/vendors", syncVendors);

// POST /api/rfqs
router.post("/rfqs", syncRFQs);
export default router;
