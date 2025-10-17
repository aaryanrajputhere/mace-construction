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
  console.log(`getVendorReplyItems called for rfq_id=${rfq_id}`);

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
            "[awards] No vendor found for email, will fall back to vendor_email field in replies if present."
          );
        }
      } catch (err) {
        console.error("[awards] Error looking up vendor by email:", err);
      }
    }

    // Query vendorReplyItem by vendor_name (preferred) or vendor_email as fallback
    let vendorReplies;
    if (vendorName) {
      console.log(
        `[awards] Querying vendorReplyItem by vendor_name=${vendorName} rfq_id=${rfq_id}`
      );
      vendorReplies = await prisma.vendorReplyItem.findMany({
        where: { vendor_name: vendorName, rfq_id },
      });
    } else if (tokenEmail) {
      console.log(
        `[awards] Querying vendorReplyItem by vendor_email=${tokenEmail} rfq_id=${rfq_id}`
      );
      // fallback if model stores vendor_email
      vendorReplies = await prisma.vendorReplyItem.findMany({
        where: { vendor_email: tokenEmail, rfq_id },
      });
    } else {
      console.warn(
        "[awards] Token did not contain vendor email nor could vendor name be resolved."
      );
      return res
        .status(400)
        .json({ error: "Token does not contain vendor email" });
    }

    console.log(
      `[awards] Found ${vendorReplies?.length ?? 0} vendor reply items`
    );
    return res.json({ success: true, vendorReplies });
  } catch (err) {
    console.error("[awards] JWT verification failed or error occurred:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
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
