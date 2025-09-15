// controllers/sync.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    console.log("Incoming vendor rows:", rows);

    if (!rows || rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No vendor data received" });
    }

    // Clear old vendors (optional, depends on your use case)
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
