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
  console.log(`[getVendorReplyItems] Called for rfq_id=${rfq_id}`);

  try {
    const secret = process.env.SECRET || process.env.JWT_SECRET;
    if (!secret) {
      console.error("[getVendorReplyItems] JWT secret not configured.");
      return res
        .status(500)
        .json({ success: false, error: "Server configuration error" });
    }

    console.log(
      "[getVendorReplyItems] Verifying token (truncated):",
      token?.slice?.(0, 16)
    );

    const decoded = jwt.verify(token, secret) as VendorReplyToken;
    const tokenEmail = decoded.email;
    const tokenRfqId =
      decoded.rfqId || (decoded as any).rfq_id || (decoded as any).rfqId;

    console.log("[getVendorReplyItems] Decoded token:", {
      tokenEmail,
      tokenRfqId,
    });

    // Validate decoded data
    if (!tokenEmail) {
      console.warn("[getVendorReplyItems] Token missing email.");
      return res
        .status(400)
        .json({ success: false, error: "Invalid token: missing email" });
    }

    if (!tokenRfqId) {
      console.warn("[getVendorReplyItems] Token missing RFQ ID.");
      return res
        .status(400)
        .json({ success: false, error: "Invalid token: missing RFQ ID" });
    }

    // Fetch vendor replies associated with this RFQ
    const vendorReplies = await prisma.vendorReplyItem.findMany({
      where: { rfq_id: tokenRfqId },
    });

    console.log(
      `[getVendorReplyItems] Found ${vendorReplies.length} reply items for RFQ ${tokenRfqId}.`
    );

    return res.status(200).json({
      success: true,
      data: vendorReplies,
    });
  } catch (error: any) {
    console.error("[getVendorReplyItems] Error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const awardItem = async (
  req: Request<VendorReplyParams>,
  res: Response
) => {
  const { rfq_id, token } = req.params;
  const { item_name, vendor_name } = req.body;

  console.log(`awardItem called for rfq_id=${rfq_id} item_name=${item_name}`);

  try {
    const secret = process.env.SECRET || process.env.JWT_SECRET;
    if (!secret) {
      console.error("[awards] Missing JWT secret in environment.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Verify and decode JWT
    console.log("[awards] Verifying token (truncated):", token?.slice?.(0, 16));
    const decoded = jwt.verify(token, secret) as VendorReplyToken;
    const tokenEmail = decoded.email;
    const tokenRfqId = decoded.rfqId || (decoded as any).rfq_id;

    console.log("[awards] Decoded token payload:", { tokenEmail, tokenRfqId });

    // Ensure token RFQ matches the route RFQ
    if (tokenRfqId && tokenRfqId !== rfq_id) {
      console.error(
        `[awards] Token RFQ (${tokenRfqId}) does not match request RFQ (${rfq_id})`
      );
      return res.status(403).json({ error: "Token does not match RFQ ID" });
    }

    // Resolve vendor name (optional if already passed in body)
    let resolvedVendorName = vendor_name || null;

    if (!resolvedVendorName && tokenEmail) {
      try {
        console.log(`[awards] Looking up vendor by email: ${tokenEmail}`);
        const vendor = await prisma.vendor.findFirst({
          where: { email: tokenEmail },
        });
        if (vendor) {
          resolvedVendorName = vendor.name;
          console.log(`[awards] Resolved vendor name: ${resolvedVendorName}`);
        } else {
          console.warn(
            "[awards] No vendor found by email; will use vendor_email fallback."
          );
        }
      } catch (lookupErr) {
        console.error("[awards] Vendor lookup error:", lookupErr);
      }
    }

    // Update vendorReplyItem
    console.log(
      `[awards] Updating vendorReplyItem: rfq_id=${rfq_id}, item_name=${item_name}, vendor_name=${
        resolvedVendorName || ""
      }, vendor_email=${!resolvedVendorName ? tokenEmail : ""}`
    );

    const updateResult = await prisma.vendorReplyItem.updateMany({
      where: {
        rfq_id,
        item_name,
        OR: [
          { vendor_name: resolvedVendorName || undefined },
          { vendor_email: tokenEmail },
        ],
      },
      data: { status: "awarded" },
    });

    console.log(`[awards] updateMany result: ${JSON.stringify(updateResult)}`);

    if (updateResult.count === 0) {
      console.warn("[awards] No matching vendorReplyItem records found.");
      return res
        .status(404)
        .json({ success: false, message: "No items updated" });
    }

    return res.json({ success: true, updated: updateResult.count });
  } catch (err) {
    console.error("[awards] Error verifying token or updating item:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
