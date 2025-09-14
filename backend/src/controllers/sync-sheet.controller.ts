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

      // 2. Prepare material data
      const materialData = {
        itemName: row.ItemName || "",
        category: row.Category || "",
        size: row.Size || "",
        unit: row.Unit || "",
        price: parseFloat(row.Price) || 0,
      };

      let material;
      if (row.id) {
        // Try to update by ID if it exists
        material = await prisma.material.update({
          where: { id: Number(row.id) },
          data: materialData,
        }).catch(async () => {
          // If not found, create without forcing the ID
          return prisma.material.create({
            data: materialData,
          });
        });
      } else {
        // If no ID, just create new
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
