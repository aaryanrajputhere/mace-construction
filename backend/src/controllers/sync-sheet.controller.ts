// controllers/sync.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const syncRFQs = async (req: Request, res: Response) => {
  try {
    const rows = req.body.data; // Expecting array of ARFQ rows from sheet
    console.log("Incoming RFQ rows from sheet:", rows);

    // Delete all rows in ARFQ table only
    await prisma.rFQ.deleteMany({});

    for (const row of rows) {
      // Prepare ARFQ data
      const arfqData = {
        rfq_id: row["rfq_id"] || "",
        created_at: row["created_at"]
          ? new Date(row["created_at"])
          : new Date(),
        requester_name: row["requester_name"] || "",
        requester_email: row["requester_email"] || "",
        requester_phone: row["requester_phone"] || "",
        project_name: row["project_name"] || "",
        project_address: row["project_address"] || "",
        needed_by: row["needed_by"] || null,
        notes: row["notes"] || null,
        items_json: row["items_json"] || "",
        vendors_json: row["vendors_json"] || "",
        drive_folder_url: row["drive_folder_url"] || null,
        status: row["status"] || null,
        email_message_id: row["email_message_id"] || null,
        decision_at: row["decision_at"] ? new Date(row["decision_at"]) : null,
        awarded_vendor_name: row["awarded_vendor_name"] || null,
        awarded_reply_id: row["awarded_reply_id"] || null,
        awarded_total_price: row["awarded_total_price"]
          ? parseFloat(row["awarded_total_price"])
          : null,
        awarded_lead_time_days: row["awarded_lead_time_days"]
          ? parseInt(row["awarded_lead_time_days"])
          : null,
        po_number: row["po_number"] || null,
        po_date: row["po_date"] ? new Date(row["po_date"]) : null,
        po_notes: row["po_notes"] || null,
      };

      await prisma.rFQ.create({
        data: arfqData,
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
