import { Router } from "express";
import { createQuote } from "../controllers/quotes.controller";

const router = Router();

// POST /api/quotes
router.post("/", createQuote);

export default router;
