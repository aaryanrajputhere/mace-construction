// controllers/sync.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const syncMaterials = async (req: Request, res: Response) => {
  try {
    const rows = req.body.data;
    console.log("Incoming rows from sheet:", rows);

    for (const row of rows) {
      // 1. Upsert vendors
      const vendorNames = (row.Vendors || "")
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);

      await Promise.all(
        vendorNames.map(async (name: string) => {
          await prisma.vendor.upsert({
            where: { name },
            update: {},
            create: { name },
          });
        })
      );

      // 2. Prepare material data
      const materialData = {
        itemName: row.ItemName || "",
        category: row.Category || "",
        size: row.Size || "",
        unit: row.Unit || "",
        price: parseFloat(row.Price) || 0,
        image: row.Image || null,
      };

      if (row.id) {
        // Try to update by ID if it exists
        await prisma.material
          .update({
            where: { id: Number(row.id) },
            data: materialData,
          })
          .catch(async () => {
            // If not found, create without forcing the ID
            await prisma.material.create({
              data: materialData,
            });
          });
      } else {
        // If no ID, just create new
        await prisma.material.create({
          data: materialData,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};
