import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface VendorReplyToken {
  vendorEmail: string;
}

interface VendorReplyParams {
  rfq_id: string;
  token: string;
}

export const getVendorReplyItems = async (
  req: Request<VendorReplyParams>,
  res: Response
) => {
  const { rfq_id, token } = req.params;

  try {
    const secret = process.env.SECRET || process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT secret is not configured in environment variables.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, secret) as VendorReplyToken;
    const vendor_email = decoded.vendorEmail;

    const vendorReplies = await prisma.vendorReplyItem.findMany({
      where: { vendor_email, rfq_id },
    });

    return res.json({ success: true, vendorReplies });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
