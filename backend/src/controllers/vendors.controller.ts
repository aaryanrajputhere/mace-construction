import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { decode } from "punycode";

const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "supersecret";

interface VendorReplyToken {
  vendorName: string;
  vendorEmail: string;
  rfqId: string;
}

export const getItems = async (req: Request, res: Response) => {
  const { rfqId, token } = req.params;
  try {
    // Validate token
    const decoded = jwt.verify(token, SECRET) as VendorReplyToken;
    if (decoded.rfqId !== rfqId) {
      return res.status(403).json({ error: "Invalid RFQ link" });
    }
    const vendorName = decoded.vendorName;
    // Fetch RFQ record
    const rfq = await prisma.rFQ.findUnique({
      where: { rfq_id: rfqId },
    });
    if (!rfq) {
      return res.status(404).json({ error: "RFQ not found" });
    }

    // Parse items_json
    let items: any[] = [];
    try {
      items = JSON.parse(rfq.items_json);
    } catch {
      return res.status(500).json({ error: "Invalid items_json format" });
    }

    const vendorItemsMap: Record<string, any[]> = {};
    items.forEach((item: any) => {
      if (item.Vendors) {
        item.Vendors.split(",")
          .map((v: string) => v.trim())
          .forEach((vendor: string) => {
            if (!vendorItemsMap[vendor]) vendorItemsMap[vendor] = [];
            vendorItemsMap[vendor].push(item);
          });
      }
    });

    // Prepare vendor list as a string
    let itemsForVendor = (vendorItemsMap[vendorName] || []).filter(
      (item: any) =>
        Array.isArray(item.selectedVendors) &&
        item.selectedVendors.includes(vendorName)
    );
    itemsForVendor = itemsForVendor.map(({ selectedVendors, ...rest }) => rest);

    return res.json({ success: true, items: itemsForVendor });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

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
