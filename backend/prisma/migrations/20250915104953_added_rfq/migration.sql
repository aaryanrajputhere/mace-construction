-- CreateTable
CREATE TABLE "public"."RFQ" (
    "id" SERIAL NOT NULL,
    "rfq_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requester_name" TEXT NOT NULL,
    "requester_email" TEXT NOT NULL,
    "requester_phone" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_address" TEXT NOT NULL,
    "needed_by" TEXT,
    "notes" TEXT,
    "items_json" TEXT NOT NULL,
    "vendors_json" TEXT NOT NULL,
    "drive_folder_url" TEXT,
    "status" TEXT,
    "email_message_id" TEXT,
    "decision_at" TIMESTAMP(3),
    "awarded_vendor_name" TEXT,
    "awarded_reply_id" TEXT,
    "awarded_total_price" DOUBLE PRECISION,
    "awarded_lead_time_days" INTEGER,
    "po_number" TEXT,
    "po_date" TIMESTAMP(3),
    "po_notes" TEXT,

    CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RFQ_rfq_id_key" ON "public"."RFQ"("rfq_id");
