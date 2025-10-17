/*
  Warnings:

  - Added the required column `vendor_email` to the `VendorReplyItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VendorReplyItem" ADD COLUMN     "vendor_email" TEXT NOT NULL;
