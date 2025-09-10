// src/services/sheets.service.ts
import { getSheetsClient } from "../utils/googleAuth";

const RFQ_SHEET_ID = process.env.RFQ_SHEET_ID || "";
const RFQ_SHEET_NAME = process.env.RFQ_SHEET_NAME || "RFQs";

export interface RFQData {
  rfq_id: string;
  created_at: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  project_name: string;
  project_address: string;
  needed_by: string;
  notes: string;
  items_json: string;
  vendors_json: string;
  drive_folder_url: string;
}

export const addRFQToSheet = async (rfq: RFQData) => {
  try {
    const sheets = getSheetsClient();

    const values = [
      [
        rfq.rfq_id,
        rfq.created_at,
        rfq.requester_name,
        rfq.requester_email,
        rfq.requester_phone,
        rfq.project_name,
        rfq.project_address,
        rfq.needed_by,
        rfq.notes,
        rfq.items_json,
        rfq.vendors_json,
        rfq.drive_folder_url,
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: RFQ_SHEET_ID,
      range: `${RFQ_SHEET_NAME}!A:L`, // ✅ now matches 12 columns
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding RFQ to sheet:", error);
    throw error;
  }
};
