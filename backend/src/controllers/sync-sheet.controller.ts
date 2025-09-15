// controllers/sync.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const syncRFQs = async (req: Request, res: Response) => {
  try {
    const rows = req.body.data; // Expecting array of ARFQ rows from sheet
    console.log("Incoming RFQ rows from sheet:", rows);

    // Delete all rows in RFQ table only
    await prisma.rFQ.deleteMany({});

    for (const row of rows) {
      // Prepare RFQ data with correct types and undefined for optional fields
      const rfqData: any = {
        rfq_id: row["rfq_id"] || "",
        created_at: row["created_at"]
          ? new Date(row["created_at"])
          : new Date(),
        requester_name: row["requester_name"] || "",
        requester_email: row["requester_email"] || "",
        requester_phone: row["requester_phone"] || "",
        project_name: row["project_name"] || "",
        project_address: row["project_address"] || "",
        items_json:
          typeof row["items_json"] === "string"
            ? row["items_json"]
            : JSON.stringify(row["items_json"] || ""),
        vendors_json:
          typeof row["vendors_json"] === "string"
            ? row["vendors_json"]
            : JSON.stringify(row["vendors_json"] || ""),
      };

      // Optional string fields
      const optionalStringFields = [
        "needed_by",
        "notes",
        "drive_folder_url",
        "status",
        "email_message_id",
        "awarded_vendor_name",
        "awarded_reply_id",
        "po_number",
        "po_notes",
      ];
      for (const field of optionalStringFields) {
        if (
          row[field] !== undefined &&
          row[field] !== null &&
          row[field] !== ""
        ) {
          rfqData[field] = String(row[field]);
        }
      }

      // Optional number fields
      if (
        row["awarded_total_price"] !== undefined &&
        row["awarded_total_price"] !== null &&
        row["awarded_total_price"] !== ""
      ) {
        rfqData["awarded_total_price"] = parseFloat(row["awarded_total_price"]);
      }
      if (
        row["awarded_lead_time_days"] !== undefined &&
        row["awarded_lead_time_days"] !== null &&
        row["awarded_lead_time_days"] !== ""
      ) {
        rfqData["awarded_lead_time_days"] = parseInt(
          row["awarded_lead_time_days"]
        );
      }

      // Optional date fields
      if (
        row["decision_at"] !== undefined &&
        row["decision_at"] !== null &&
        row["decision_at"] !== ""
      ) {
        rfqData["decision_at"] = new Date(row["decision_at"]);
      }
      if (
        row["po_date"] !== undefined &&
        row["po_date"] !== null &&
        row["po_date"] !== ""
      ) {
        rfqData["po_date"] = new Date(row["po_date"]);
      }

      await prisma.rFQ.create({
        data: rfqData,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};

export const syncMaterials = async (req: Request, res: Response) => {
  try {
    const rows = req.body.data;
    console.log("Incoming rows from sheet:", rows);

    // Delete all rows in Material table only
    await prisma.material.deleteMany({});

    for (const row of rows) {
      // Prepare material data, store vendor names as a string
      const materialData = {
        itemName: row["Item Name"] || "",
        category: row["Category"] || "",
        size: row["Size/Option"] || "",
        unit: row["Unit"] || "",
        price: parseFloat(row["Price"]) || 0,
        image: row["Image"] || null,
        vendors: row["Vendors"] || "",
      };

      await prisma.material.create({
        data: materialData,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};
export const syncVendors = async (req: Request, res: Response) => {
  try {
    const rows = req.body.data; // Expecting [{ VendorName, Email, Phone, Notes }, ...]

    if (!rows || rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No vendor data received" });
    }

    // Clear old vendors
    await prisma.vendor.deleteMany({});

    // Insert all vendors
    const inserted = await prisma.vendor.createMany({
      data: rows.map((row: any) => ({
        name: row["Vendor Name"],
        email: row["Email"],
        phone: row["Phone"] || null,
        notes: row["Notes"] || null,
      })),
    });

    return res.json({
      success: true,
      message: `${inserted.count} vendors synced successfully`,
    });
  } catch (error: any) {
    console.error("Error syncing vendors:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
