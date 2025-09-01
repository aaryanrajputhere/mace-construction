import { Request, Response } from "express";
import { uploadFilesToDrive } from "../services/drive.service";
import { logRFQToSheet } from "../services/sheets.service";
import { sendRFQEmails } from "../services/mail.service";
import { generateRFQ } from "../utils/generateRFQ";

export const createQuote = async (req: Request, res: Response) => {
  try {
    const { projectInfo, items, vendors } = req.body;
    const files = req.files as Express.Multer.File[];

    // 1. Upload files to Drive
    const driveLinks = await uploadFilesToDrive(files);

    // 2. Generate RFQ ID
    const rfqId = generateRFQ();

    // 3. Log to Google Sheet
    await logRFQToSheet(rfqId, projectInfo, items, vendors, driveLinks);

    // 4. Email vendors
    await sendRFQEmails(rfqId, projectInfo, items, vendors, driveLinks);

    res.status(201).json({ success: true, rfqId, driveLinks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create quote" });
  }
};
