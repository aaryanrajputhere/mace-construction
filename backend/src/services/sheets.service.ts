// src/services/sheets.service.ts
import { getSheetsClient } from "../utils/googleAuth";
import sgMail from "@sendgrid/mail";

const RFQ_SHEET_ID = process.env.RFQ_SHEET_ID || "";
const RFQ_SHEET_NAME = process.env.RFQ_SHEET_NAME || "RFQs";

// Vendor Reply Sheet config
const VENDOR_REPLY_SHEET_ID = process.env.VENDOR_REPLY_SHEET_ID || "";
const VENDOR_REPLY_SHEET_NAME =
  process.env.VENDOR_REPLY_SHEET_NAME || "VendorReplies";

export interface VendorReplyData {
  rfq_id: string;
  reply_id: string;
  submitted_at: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  prices_text: string;
  price_subtotal?: string;
  discount?: string;
  taxes?: string;
  delivery_charges?: string;
  total_price?: string;
  lead_time_days?: string;
  delivery_date?: string;
  notes?: string;
  substitutions?: string;
  file_link?: string;
  review_status?: string;
  decided_at?: string;
}

export const addVendorReplyToSheet = async (reply: VendorReplyData) => {
  try {
    console.log("Sheet Service - Notes value:", reply.notes);
    console.log("Sheet Service - All reply data:", {
      rfq_id: reply.rfq_id,
      reply_id: reply.reply_id,
      notes: reply.notes,
      price_subtotal: reply.price_subtotal,
      discount: reply.discount,
      delivery_charges: reply.delivery_charges,
      total_price: reply.total_price,
    });

    const sheets = getSheetsClient();
    const values = [
      [
        reply.rfq_id, // A: rfq_id
        reply.reply_id, // B: reply_id
        reply.submitted_at, // C: submitted_at
        reply.vendor_name, // D: vendor_name
        reply.vendor_email, // E: vendor_email
        reply.vendor_phone, // F: vendor_phone
        reply.prices_text, // G: prices_text
        reply.price_subtotal, // H: price_subtotal
        reply.discount, // I: discount
        reply.delivery_charges, // J: delivery_charges
        reply.taxes, // K: taxes
        reply.total_price, // L: total_price
        reply.lead_time_days, // M: lead_time_days
        reply.delivery_date, // N: delivery_date
        reply.notes, // O: vendor_notes (mapped from notes)
        reply.file_link, // P: file_link
        reply.review_status, // Q: review_status
        reply.decided_at, // R: decided_at
      ],
    ];

    console.log("Adding to sheet:", {
      spreadsheetId: VENDOR_REPLY_SHEET_ID,
      sheetName: VENDOR_REPLY_SHEET_NAME,
      range: `${VENDOR_REPLY_SHEET_NAME}!A:R`,
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: VENDOR_REPLY_SHEET_ID,
      range: `${VENDOR_REPLY_SHEET_NAME}!A:R`, // 18 columns
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding vendor reply to sheet:", error);
    throw error;
  }
};

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

