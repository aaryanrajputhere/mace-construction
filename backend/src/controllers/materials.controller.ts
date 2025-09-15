import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany();
    res.json({ success: true, data: materials });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch materials", error });
  }
};
