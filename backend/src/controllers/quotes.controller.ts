import { Request, Response } from "express";

// Mock in-memory data store (replace with DB/Sheets later)
const quotes: any[] = [];

export const getQuotes = (req: Request, res: Response) => {
  res.json({ success: true, data: quotes });
};

export const createQuote = (req: Request, res: Response) => {
  const newQuote = { id: quotes.length + 1, ...req.body };
  quotes.push(newQuote);
  res.status(201).json({ success: true, data: newQuote });
};
