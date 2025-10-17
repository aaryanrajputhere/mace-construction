-- CreateTable
CREATE TABLE "public"."VendorReplyItem" (
    "id" SERIAL NOT NULL,
    "rfq_id" TEXT NOT NULL,
    "reply_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "delivery_charge" DOUBLE PRECISION,
    "lead_time" TEXT NOT NULL,
    "substitutions" TEXT,
    "file_link" TEXT,
    "vendor_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'pending',

    CONSTRAINT "VendorReplyItem_pkey" PRIMARY KEY ("id")
);
