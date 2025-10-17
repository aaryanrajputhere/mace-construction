import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface VendorReplyToken {
  email: string;
  rfqId?: string;
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
    const tokenEmail = decoded.email;
    const tokenRfqId =
      decoded.rfqId || (decoded as any).rfqId || (decoded as any).rfq_id;

    // Ensure token rfq matches route rfq
    if (tokenRfqId && tokenRfqId !== rfq_id) {
      console.error(
        `Token RFQ (${tokenRfqId}) does not match requested RFQ (${rfq_id})`
      );
      return res.status(403).json({ error: "Token does not match RFQ ID" });
    }

    // Try to resolve vendor name from vendor table using email
    let vendorName: string | null = null;
    if (tokenEmail) {
      try {
        const vendor = await prisma.vendor.findFirst({
          where: { email: tokenEmail },
        });
        if (vendor) vendorName = vendor.name;
      } catch (err) {
        console.error("Error looking up vendor by email:", err);
      }
    }

    // Query vendorReplyItem by vendor_name (preferred) or vendor_email as fallback
    let vendorReplies;
    if (vendorName) {
      vendorReplies = await prisma.vendorReplyItem.findMany({
        where: { vendor_name: vendorName, rfq_id },
      });
    } else if (tokenEmail) {
      // fallback if model stores vendor_email
      vendorReplies = await prisma.vendorReplyItem.findMany({
        where: { vendor_email: tokenEmail, rfq_id },
      });
    } else {
      return res
        .status(400)
        .json({ error: "Token does not contain vendor email" });
    }

    return res.json({ success: true, vendorReplies });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
