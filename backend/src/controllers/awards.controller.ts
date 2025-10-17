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
  console.log(`awardItem called for rfq_id=${rfq_id}`);
  try {
    const secret = process.env.SECRET || process.env.JWT_SECRET;
    if (!secret) {
      console.error(
        "[awards] JWT secret is not configured in environment variables."
      );
      return res.status(500).json({ error: "Server configuration error" });
    }

    console.log("[awards] Verifying token (truncated):", token?.slice?.(0, 16));
    const decoded = jwt.verify(token, secret) as VendorReplyToken;
    const tokenEmail = decoded.email;
    const tokenRfqId =
      decoded.rfqId || (decoded as any).rfqId || (decoded as any).rfq_id;

    console.log("[awards] Decoded token:", { tokenEmail, tokenRfqId });

    // Ensure token rfq matches route rfq
    if (tokenRfqId && tokenRfqId !== rfq_id) {
      console.error(
        `[awards] Token RFQ (${tokenRfqId}) does not match requested RFQ (${rfq_id})`
      );
      return res.status(403).json({ error: "Token does not match RFQ ID" });
    }

    // Try to resolve vendor name from vendor table using email
    let vendorName: string | null = null;
    if (tokenEmail) {
      try {
        console.log(`[awards] Looking up vendor by email: ${tokenEmail}`);
        const vendor = await prisma.vendor.findFirst({
          where: { email: tokenEmail },
        });
        if (vendor) {
          vendorName = vendor.name;
          console.log(`[awards] Resolved vendor name: ${vendorName}`);
        } else {
          console.log(
            "[awards] No vendor found for email; using vendor_email fallback."
          );
        }
      } catch (err) {
        console.error("[awards] Error looking up vendor by email:", err);
      }
    }

    console.log(
      `[awards] Updating vendorReplyItem rows to status=awarded for rfq_id=${rfq_id} vendor_name=${
        vendorName || ""
      } vendor_email=${!vendorName ? tokenEmail : ""}`
    );
    const updateResult = await prisma.vendorReplyItem.updateMany({
      where: {
        rfq_id,
        vendor_name: vendorName || undefined,
        vendor_email: !vendorName ? tokenEmail : undefined,
      },
      data: { status: "awarded" },
    });

    console.log(`[awards] updateMany result: ${JSON.stringify(updateResult)}`);

    return res.json({ success: true, updated: updateResult.count });
  } catch (err) {
    console.error("[awards] JWT verification failed or error occurred:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
