/*
  Warnings:

  - You are about to drop the `MaterialVendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MaterialVendor" DROP CONSTRAINT "MaterialVendor_materialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MaterialVendor" DROP CONSTRAINT "MaterialVendor_vendorId_fkey";

-- DropTable
DROP TABLE "public"."MaterialVendor";
