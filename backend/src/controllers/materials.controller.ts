import { Request, Response } from "express";

// For now, static list — later pull from Google Sheets
const materials = [
  { id: 1, name: "Stud", unit: "piece", price: 5 },
  { id: 2, name: "OSB Sheet", unit: "sheet", price: 25 },
  { id: 3, name: "Drywall", unit: "sheet", price: 15 },
];

export const getMaterials = (req: Request, res: Response) => {
  res.json({ success: true, data: materials });
};
