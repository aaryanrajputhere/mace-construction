// src/controllers/rfq.controller.ts
import { Request, Response } from "express";
import { saveRFQFiles } from "../services/drive.service";
import { generateRFQ } from "../utils/generateRFQ";
import { addRFQToSheet, RFQData } from "../services/sheets.service";
import { sendRFQEmail, rfqAward } from "../services/mail.service";
import { PrismaClient } from "@prisma/client";
import { Console } from "console";

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
    console.log("-".repeat(100));
    console.log(`RFQ Initiated ${rfqId}`);
    // Map each vendor to their items (normalize vendor names to reduce mismatches)
    const vendorItemsMap: Record<string, any[]> = {};
    items.forEach((item: any) => {
      if (item.Vendors) {
        item.Vendors.split(",")
          .map((v: string) => v.trim())
          .forEach((vendorRaw: string) => {
            const vendor = vendorRaw.trim();
            if (!vendor) return;
            // Keep the original casing as the key, but also support lookup via a normalized map below
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
    // 2️⃣b Add RFQ to Prisma DB
    await prisma.rFQ.create({
      data: {
        rfq_id: rfqId,
        created_at: new Date(),
        requester_name: projectInfo.requesterName || "",
        requester_email: projectInfo.requesterEmail || "",
        requester_phone: String(projectInfo.requesterPhone || ""),
        project_name: projectInfo.projectName || "",
        project_address: projectInfo.siteAddress || "",
        needed_by: projectInfo.neededBy || "",
        notes: projectInfo.notes || "",
        items_json: item_json || "",
        vendors_json: vendors_json || "",
        drive_folder_url: folderLink || "",
        // status, email_message_id, decision_at, awarded_vendor_name, etc. can be added as needed
      },
    });
    const sheetResponse = await addRFQToSheet(rfqData);

    // Fetch all vendors from the database
    const vendors = await prisma.vendor.findMany({
      select: {
        name: true,
        email: true,
      },
    });

    // Create lookup object from vendors array
    // Build both a direct-name lookup and a normalized (lowercased trimmed) lookup to increase match tolerance
    const vendorEmailLookup: Record<string, string> = {};
    const vendorEmailLookupNormalized: Record<string, string> = {};
    vendors.forEach((vendor) => {
      // Coerce nullable vendor.email to empty string to satisfy TypeScript and keep falsy-check behavior
      const emailStr = vendor.email || "";
      vendorEmailLookup[vendor.name] = emailStr;
      if (vendor.name) {
        vendorEmailLookupNormalized[vendor.name.trim().toLowerCase()] =
          emailStr;
      }
    });

    console.log(
      "Vendor items map:",
      Object.keys(vendorItemsMap).length,
      "vendors"
    );
    console.log(
      "Vendor items keys (sample):",
      Object.keys(vendorItemsMap).slice(0, 20)
    );

    // Send RFQ emails to each vendor with their items
    for (const [vendor, vendorItems] of Object.entries(vendorItemsMap)) {
      // Try direct lookup first, then normalized lookup as a fallback
      let email = vendorEmailLookup[vendor];
      if (!email) {
        const normalized = vendor.trim().toLowerCase();
        email = vendorEmailLookupNormalized[normalized];
      }

      console.log("sendRFQEmail args:", {
        rfqId,
        projectInfo,
        items: vendorItems,
        vendor: { email, name: vendor },
        driveLinks: fileLinks,
      });

      if (!email) {
        console.warn(
          `Skipping email for vendor '${vendor}' (no matching vendor email found in DB).`
        );
        continue;
      }

      await sendRFQEmail(
        rfqId,
        projectInfo,
        vendorItems,
        { email, name: vendor },
        fileLinks
      );
    }

    // Send award access email to the requester
    let awardEmailSent = false;
    console.log(
      `🎯 Starting award email process for: ${projectInfo.requesterEmail}`
    );
    try {
      console.log(`📬 Calling rfqAward function...`);
      const result = await rfqAward(projectInfo.requesterEmail, rfqId);
      console.log(`✅ rfqAward result:`, result);
      console.log(
        `Award access email sent to requester: ${projectInfo.requesterEmail}`
      );
      awardEmailSent = true;
    } catch (error) {
      console.error(`❌ Failed to send award email to requester:`, error);
      console.error(`❌ Error type:`, typeof error);
      console.error(
        `❌ Error message:`,
        error instanceof Error ? error.message : error
      );
      // Don't fail the entire request if award email fails
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
      awardEmailSent,
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
