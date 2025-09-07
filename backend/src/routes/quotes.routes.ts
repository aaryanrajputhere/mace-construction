// routes/quote.routes.ts
import express from "express";
import multer from "multer";
import { createQuote } from "../controllers/quotes.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/apply", upload.array("files"), createQuote);

export default router;
