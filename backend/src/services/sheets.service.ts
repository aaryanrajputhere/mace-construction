// src/services/sheets.service.ts
import { getSheetsClient } from "../utils/googleAuth";

/**
 * Google Sheet ID and target sheet/tab name.
 * Extracted from the link you shared.
 */
const SHEET_ID = "1u8LSSKZl5sJwecpwUNs5_CP4mvPSO6EOKqmEh8DrWvA";
const SHEET_NAME = "RFQs"; // change if actual tab is different

/**
 * RFQ type definition
 */
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
}

/**
 * Append a new RFQ row to the Google Sheet
 */
export const addRFQToSheet = async (rfq: RFQData) => {
  try {
    const sheets = getSheetsClient();

    // Row in the same order as your header
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
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:I`, // A through I (9 columns)
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding RFQ to sheet:", error);
    throw error;
  }
};
