import { addVendorReplyToSheet } from "../services/sheets.service";
import { saveVendorReplyFiles } from "../services/drive.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "supersecret";

interface VendorReplyToken {
  vendorName: string;
  vendorEmail: string;
  rfqId: string;
}

interface ItemReply {
  itemId: string;
  pricing: string;
  leadTime: string;
  notes: string;
  substitutions: string;
  files?: Express.Multer.File[];
}

interface VendorReplyRequest {
  itemReplies: ItemReply[];
  deliveryCharges: string;
  discount: string;
  summaryNotes: string;
}

export const getItems = async (req: Request, res: Response) => {
  const { rfqId, token } = req.params;
  try {
    // Validate token
    const decoded = jwt.verify(token, SECRET) as VendorReplyToken;
    if (decoded.rfqId !== rfqId) {
      return res.status(403).json({ error: "Invalid RFQ link" });
    }
    const vendorName = decoded.vendorName;
    // Fetch RFQ record
    const rfq = await prisma.rFQ.findUnique({
      where: { rfq_id: rfqId },
    });
    if (!rfq) {
      return res.status(404).json({ error: "RFQ not found" });
    }

    // Parse items_json
    let items: any[] = [];
    try {
      items = JSON.parse(rfq.items_json);
    } catch {
      return res.status(500).json({ error: "Invalid items_json format" });
    }
    console.log(vendorName);
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
    let itemsForVendor = (vendorItemsMap[vendorName] || []).filter(
      (item: any) =>
        Array.isArray(item.selectedVendors) &&
        item.selectedVendors.includes(vendorName)
    );
    itemsForVendor = itemsForVendor.map(({ selectedVendors, ...rest }) => rest);

    return res.json({ success: true, items: itemsForVendor });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const handleVendorReply = async (req: Request, res: Response) => {
  const { rfqId, token } = req.params;

  // Parse JSON data from FormData
  let itemReplies: any[] = [];
  try {
    itemReplies = req.body.itemReplies ? JSON.parse(req.body.itemReplies) : [];
  } catch (parseErr) {
    console.error("Error parsing itemReplies:", parseErr);
    return res.status(400).json({ error: "Invalid itemReplies format" });
  }

  const deliveryCharges = req.body.deliveryCharges || "";
  const discount = req.body.discount || "";
  const summaryNotes = req.body.summaryNotes || "";

  // Handle uploaded files
  const files = (req.files as Express.Multer.File[]) || [];

  try {
    const decoded = jwt.verify(token, SECRET) as VendorReplyToken;

    if (decoded.rfqId !== rfqId) {
      return res.status(403).json({ error: "Invalid RFQ link" });
    }

    // Fetch vendor details from Prisma using email (not unique, so use findFirst)
    const vendor = await prisma.vendor.findFirst({
      where: { email: decoded.vendorEmail },
      select: { name: true, email: true, phone: true },
    });

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Generate unique reply ID
    const replyId = `${rfqId}-${vendor.email}-${Date.now()}`;

    console.log("Vendor Reply Received:", {
      rfqId,
      replyId,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      vendorPhone: vendor.phone,
      deliveryCharges,
      discount,
      summaryNotes,
    });

    // Process files if any exist
    let driveLinks: { [itemId: string]: string[] } = {};
    let replyFolderLink = "";
    console.log("Parsed itemReplies:", itemReplies);
    console.log("Received files:", files);

    // Extract files and map them to items for drive upload
    const itemFiles: { [itemId: string]: Express.Multer.File[] } = {};
    if (files && files.length > 0) {
      // Group files by item index based on field names like 'files_0', 'files_1', etc.
      files.forEach((file) => {
        if (file.fieldname && file.fieldname.startsWith("files_")) {
          const itemIndex = parseInt(file.fieldname.split("_")[1]);
          const itemId = itemReplies[itemIndex]?.itemId || `item-${itemIndex}`;

          if (!itemFiles[itemId]) {
            itemFiles[itemId] = [];
          }
          itemFiles[itemId].push(file);
        }
      });
    }

    // Upload files to Google Drive if any exist
    if (Object.keys(itemFiles).length > 0) {
      try {
        const driveResult = await saveVendorReplyFiles(replyId, itemFiles);
        driveLinks = driveResult.itemFileLinks;
        replyFolderLink = driveResult.replyFolderLink;
        console.log("Files uploaded to Drive:", driveResult);
      } catch (driveErr) {
        console.error("Failed to upload files to Drive:", driveErr);
        // Continue without files rather than failing completely
      }
    }

    // Add each item reply to the sheet
    if (itemReplies && itemReplies.length > 0) {
      for (const itemReply of itemReplies) {
        try {
          await addVendorReplyToSheet({
            rfq_id: rfqId,
            reply_id: `${replyId}-item-${itemReply.itemId}`,
            submitted_at: new Date().toISOString(),
            vendor_name: vendor.name,
            vendor_email: vendor.email || "",
            vendor_phone: vendor.phone || "",
            prices_text: itemReply.pricing || "",
            lead_time_days: itemReply.leadTime || "",
            notes: itemReply.notes || "",
            substitutions: itemReply.substitutions || "",
            file_link: replyFolderLink,
            // Summary fields (could be duplicated across items or handled separately)
            price_subtotal: deliveryCharges || "",
            taxes: discount || "",
            total_price: summaryNotes || "",
          });
        } catch (sheetErr) {
          console.error(
            `Failed to add item ${itemReply.itemId} to sheet:`,
            sheetErr
          );
          // Continue with other items
        }
      }
    } else {
      // Fallback: add a single entry if no itemReplies provided (backward compatibility)
      try {
        await addVendorReplyToSheet({
          rfq_id: rfqId,
          reply_id: replyId,
          submitted_at: new Date().toISOString(),
          vendor_name: vendor.name,
          vendor_email: vendor.email || "",
          vendor_phone: vendor.phone || "",
          prices_text: "",
          lead_time_days: "",
          notes: summaryNotes || "",
          price_subtotal: deliveryCharges || "",
          taxes: discount || "",
          total_price: "",
        });
      } catch (sheetErr) {
        console.error("Failed to add vendor reply to sheet:", sheetErr);
      }
    }

    return res.status(200).json({
      message: "Reply submitted successfully",
      vendor: {
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
      },
      replyId,
      itemsProcessed: itemReplies?.length || 0,
      filesUploaded: Object.values(driveLinks).flat().length,
      replyFolderLink,
    });
  } catch (err) {
    console.error("Error in handleVendorReply:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
