import { Router } from "express";
import { getMaterials } from "../controllers/materials.controller";

const router = Router();

// GET /api/materials
router.get("/", getMaterials);

export default router;
