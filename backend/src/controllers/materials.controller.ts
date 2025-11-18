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

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { itemName, category, size, unit, price, image, vendors } = req.body;
    const newMaterial = await prisma.material.create({
      data: {
        itemName,
        category,
        size,
        unit,
        price,
        image,
        vendors,
      },
    });
    res.status(201).json({ success: true, data: newMaterial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create material", error });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await prisma.material.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, data: deletedMaterial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete material", error });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { itemName, category, size, unit, price, image, vendors } = req.body;
    const updatedMaterial = await prisma.material.update({
      where: { id: Number(id) },
      data: {
        itemName,
        category,
        size,
        unit,
        price,
        image,
        vendors,
      },
    });
    res.json({ success: true, data: updatedMaterial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update material", error });
  }
};
