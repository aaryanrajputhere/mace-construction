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

export const handleVendorReply = (req: Request, res: Response) => {
  const { rfqId, token } = req.params;
  const { pricing, leadTime, notes } = req.body; // expecting vendor reply fields

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET) as VendorReplyToken;

    if (decoded.rfqId !== rfqId) {
      return res.status(403).json({ error: "Invalid RFQ link" });
    }

    console.log("Vendor Reply Received:", {
      rfqId,
      vendorName: decoded.vendorName,
      vendorEmail: decoded.vendorEmail,
      pricing,
      leadTime,
      notes,
    });

    return res.status(200).json({
      message: "Reply submitted successfully",
      vendor: {
        name: decoded.vendorName,
        email: decoded.vendorEmail,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany();
    res.json({ success: true, data: vendors });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch vendors", error });
  }
};
