// src/services/sheets.service.ts
import { getSheetsClient } from "../utils/googleAuth";

/**
 * Google Sheet ID and target sheet/tab name.
 * Extracted from the link you shared.
 */
const SHEET_ID = "1Jv1nNsh5GMm3k9OyD8k2OP4innj1LoIqzZqEH38B1jY";
const SHEET_NAME = "Materials"; // Update this if the actual tab name is different

/**
 * Fetches all data from the Google Sheet
 */
export const getAllRFQsFromSheet = async () => {
  try {
    const sheets = getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:Z`, // Adjust columns if needed
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("No data found.");
      return [];
    }

    // Optionally, map rows to objects if you know the headers
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      let obj: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching RFQs from sheet:", error);
    throw error;
  }
};

getAllRFQsFromSheet();
