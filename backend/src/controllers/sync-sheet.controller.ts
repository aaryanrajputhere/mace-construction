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

      const vendors = await Promise.all(
        vendorNames.map(async (name: string) => {
          return prisma.vendor.upsert({
            where: { name },
            update: {},
            create: { name },
          });
        })
      );

      // 2. Upsert material (auto-generate ID if missing)
      const materialData = {
        itemName: row.ItemName || "",
        category: row.Category || "",
        size: row.Size || "",
        unit: row.Unit || "",
        price: parseFloat(row.Price) || 0,
      };

      let material;
      if (row.id) {
        // Use id if provided
        material = await prisma.material.upsert({
          where: { id: row.id },
          update: materialData,
          create: { id: row.id, ...materialData },
        });
      } else {
        // Auto-generate id
        material = await prisma.material.create({
          data: materialData,
        });
      }

      // 3. Connect material with vendors
      for (const vendor of vendors) {
        await prisma.materialVendor.upsert({
          where: {
            materialId_vendorId: {
              materialId: material.id,
              vendorId: vendor.id,
            },
          },
          update: {},
          create: {
            materialId: material.id,
            vendorId: vendor.id,
          },
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};
