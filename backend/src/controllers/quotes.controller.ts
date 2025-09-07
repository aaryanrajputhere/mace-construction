// src/controllers/rfq.controller.ts
import { Request, Response } from "express";
import { saveRFQFiles } from "../services/drive.service";
import { generateRFQ } from "../utils/generateRFQ";
import { addRFQToSheet, RFQData } from "../services/sheets.service";
import { sendRFQEmails } from "../services/mail.service";

export const createQuote = async (req: Request, res: Response) => {
  try {
    const projectInfo = req.body.projectInfo
      ? JSON.parse(req.body.projectInfo)
      : null;
    const items = req.body.items ? JSON.parse(req.body.items) : [];
    const vendors = req.body.vendors ? JSON.parse(req.body.vendors) : [];
    const files = req.files as Express.Multer.File[];

    if (!projectInfo || items.length === 0 || vendors.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const rfqId = generateRFQ();

    // 1️⃣ Save RFQ files (creates folder + uploads files)
    const { folderLink, fileLinks } = await saveRFQFiles(files, `RFQ-${rfqId}`);

    // 2️⃣ Add RFQ metadata to Google Sheet
    const rfqData: RFQData = {
      rfq_id: rfqId,
      created_at: new Date().toISOString(),
      requester_name: projectInfo.requesterName || "",
      requester_email: projectInfo.requesterEmail || "",
      requester_phone: projectInfo.requesterPhone || "",
      project_name: projectInfo.projectName || "",
      project_address: projectInfo.projectAddress || "",
      needed_by: projectInfo.neededBy || "",
      notes: projectInfo.notes || "",
    };

    const sheetResponse = await addRFQToSheet(rfqData);

    // 3️⃣ Send RFQ emails to vendors
    await sendRFQEmails(
      rfqId,
      {
        name: rfqData.project_name,
        address: rfqData.project_address,
        neededBy: rfqData.needed_by,
      },
      items,
      vendors,
      fileLinks
    );

    // 4️⃣ Respond with Drive + Sheet info and sheet response data
    res.status(201).json({
      success: true,
      rfqId,
      folderLink,
      fileLinks,
      sheetUpdated: true,
      sheetResponse,
      emailsSent: true,
    });
  } catch (err: any) {
    console.error("❌ Error creating RFQ:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create quote",
    });
  }
};
