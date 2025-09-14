// controllers/sync.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const syncMaterials = async (req: Request, res: Response) => {
  try {
    const rows = req.body.data; // array of rows sent from Google Sheets

    for (const row of rows) {
      // Example for materials table
      await prisma.material.upsert({
        where: { id: row.id }, // unique identifier
        update: {
          itemName: row.ItemName,
          category: row.Category,
          size: row.Size,
          unit: row.Unit,
          price: parseFloat(row.Price),
          vendors: row.Vendors,
        },
        create: {
          itemName: row.ItemName,
          category: row.Category,
          size: row.Size,
          unit: row.Unit,
          price: parseFloat(row.Price),
          vendors: row.Vendors,
        },
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};
