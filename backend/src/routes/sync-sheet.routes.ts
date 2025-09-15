import { Router } from "express";
import {
  syncMaterials,
  syncVendors,
} from "../controllers/sync-sheet.controller";

const router = Router();

// POST /api/materials
router.post("/materials", syncMaterials);

// POST /api/vendors
router.post("/vendors", syncVendors);

export default router;
