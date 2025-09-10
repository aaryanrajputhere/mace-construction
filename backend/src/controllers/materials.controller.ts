import { Request, Response } from "express";
import { getSheetsClient } from "../utils/googleAuth";

const MATERIALS_SHEET_ID = process.env.MATERIALS_SHEET_ID || "";
const MATERIALS_SHEET_NAME = process.env.MATERIALS_SHEET_NAME || "";

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: MATERIALS_SHEET_ID,
      range: `${MATERIALS_SHEET_NAME}!A:Z`,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      let obj: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch sheet", error });
  }
};
