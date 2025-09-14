import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getSheetsClient } from "../utils/googleAuth";

const VENDORS_SHEET_ID = process.env.VENDORS_SHEET_ID || "";
const VENDORS_SHEET_NAME = process.env.VENDORS_SHEET_NAME || "";

const SECRET = process.env.JWT_SECRET || "supersecret";

interface VendorReplyToken {
  vendorName: string;
  vendorEmail: string;
  rfqId: string;
}

export const handleVendorReply = (req: Request, res: Response) => {
  const { rfqId, token } = req.params;
  const { pricing, leadTime, notes } = req.body; // expecting vendor reply fields

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET) as VendorReplyToken;

    if (decoded.rfqId !== rfqId) {
      return res.status(403).json({ error: "Invalid RFQ link" });
    }

    console.log("Vendor Reply Received:", {
      rfqId,
      vendorName: decoded.vendorName,
      vendorEmail: decoded.vendorEmail,
      pricing,
      leadTime,
      notes,
    });

    return res.status(200).json({
      message: "Reply submitted successfully",
      vendor: {
        name: decoded.vendorName,
        email: decoded.vendorEmail,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const getVendors = async (req: Request, res: Response) => {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: VENDORS_SHEET_ID,
      range: `${VENDORS_SHEET_NAME}!A:Z`, // Adjust columns if needed
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
      .json({ success: false, message: "Failed to fetch vendors", error });
  }
};
