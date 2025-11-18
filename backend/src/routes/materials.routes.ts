import { Router } from "express";
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
  updateMaterial,
} from "../controllers/materials.controller";

const router = Router();

// GET /api/materials
router.get("/", getMaterials);
// POST /api/materials
router.post("/", createMaterial);
// DELETE /api/materials/:id
router.delete("/:id", deleteMaterial);
// PUT /api/materials/:id
router.put("/:id", updateMaterial);

export default router;
