import { Request, Response } from "express";
import fetch from "node-fetch";

// Replace with your Sheet ID (the long string in the URL)
const SHEET_ID = "YOUR_SHEET_ID";
// Replace with your sheet name (or tab name)
const SHEET_NAME = "Sheet1";

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

    const response = await fetch(url);
    const text = await response.text();

    // Google Sheets JSON is wrapped in some extra text → clean it up
    const json = JSON.parse(text.substr(47).slice(0, -2));

    const rows = json.table.rows.map((row: any, index: number) => ({
      id: index + 1,
      category: row.c[0]?.v || "",
      name: row.c[1]?.v || "",
      description: row.c[2]?.v || "",
      unit: row.c[3]?.v || "",
      brand: row.c[4]?.v || "",
      sku: row.c[5]?.v || "",
      price: parseFloat(row.c[6]?.v) || 0,
      supplier: row.c[7]?.v || "",
      weight: parseFloat(row.c[8]?.v) || 0,
      dimensions: row.c[9]?.v || "",
      stock: row.c[10]?.v || "",
      imageUrl: row.c[11]?.v || "",
      notes: row.c[12]?.v || "",
    }));

    res.json({ success: true, data: rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch sheet", error });
  }
};
