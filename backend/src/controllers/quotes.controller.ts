// src/controllers/rfq.controller.ts
import { Request, Response } from "express";
import { saveRFQFiles } from "../services/drive.service";
import { generateRFQ } from "../utils/generateRFQ";
import { addRFQToSheet, RFQData } from "../services/sheets.service";
import { sendRFQEmail } from "../services/mail.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createQuote = async (req: Request, res: Response) => {
  try {
    const projectInfo = req.body.projectInfo
      ? JSON.parse(req.body.projectInfo)
      : null;
    const items = req.body.items ? JSON.parse(req.body.items) : [];
    const item_json = JSON.stringify(items); // <-- stringify the array
    const files = req.files as Express.Multer.File[];

    if (!projectInfo || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate required contact fields
    if (
      !projectInfo.requesterName ||
      !projectInfo.requesterEmail ||
      !projectInfo.requesterPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Contact information (name, email, phone) is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(projectInfo.requesterEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const rfqId = generateRFQ();

    // Map each vendor to their items
    const vendorItemsMap: Record<string, any[]> = {};
    items.forEach((item: any) => {
      if (item.Vendors) {
        item.Vendors.split(",")
          .map((v: string) => v.trim())
          .forEach((vendor: string) => {
            if (!vendorItemsMap[vendor]) vendorItemsMap[vendor] = [];
            vendorItemsMap[vendor].push(item);
          });
      }
    });

    // Prepare vendor list as a string
    const vendorsArray = Object.keys(vendorItemsMap);
    const vendors_json = vendorsArray.join(", ");

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
      project_address: projectInfo.siteAddress || "", // Fixed: was projectAddress, should be siteAddress
      needed_by: projectInfo.neededBy || "",
      notes: projectInfo.notes || "",
      items_json: item_json || "",
      vendors_json: vendors_json || "",
      drive_folder_url: folderLink || "",
    };

    const sheetResponse = await addRFQToSheet(rfqData);

    // Fetch all vendors from the database
    const vendors = await prisma.vendor.findMany({
      select: {
        name: true,
        email: true,
      },
    });

    // Create lookup object from vendors array
    const vendorEmailLookup: Record<string, string> = vendors.reduce(
      (acc, vendor) => ({
        ...acc,
        [vendor.name]: vendor.email,
      }),
      {}
    );

    // Send RFQ emails to each vendor with their items
    for (const [vendor, vendorItems] of Object.entries(vendorItemsMap)) {
      const email = vendorEmailLookup[vendor];
      console.log(email);
      if (!email) continue; // skip if no email found

      await sendRFQEmail(
        rfqId,
        {
          name: rfqData.project_name,
          address: rfqData.project_address,
          neededBy: rfqData.needed_by,
          requesterName: rfqData.requester_name,
          requesterEmail: rfqData.requester_email,
          requesterPhone: rfqData.requester_phone,
        },
        vendorItems,
        { email, name: vendor },
        fileLinks
      );
    }

    // 5️⃣ Respond with Drive + Sheet info and email confirmation
    res.status(201).json({
      success: true,
      rfqId,
      folderLink,
      fileLinks,
      sheetUpdated: true,
      sheetResponse,
      emailsSent: true,
      // vendorCount: vendors.length,
    });
  } catch (err: any) {
    console.error("❌ Error creating RFQ:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create quote",
    });
  }
};
