import { Router } from "express";
import { createQuote, getQuotes } from "../controllers/quotes.controller";

const router = Router();

// GET /api/quotes
router.get("/", getQuotes);

// POST /api/quotes
router.post("/", createQuote);

export default router;
