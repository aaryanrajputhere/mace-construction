import { Router } from "express";
import { syncMaterials } from "../controllers/sync-sheet.controller";

const router = Router();

// GET /api/materials
router.get("/materials", syncMaterials);

// GET /api/vendors
// router.get("/vendors", syncVendors);

export default router;
