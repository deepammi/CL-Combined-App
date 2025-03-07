-- AlterTable
ALTER TABLE "Call_logs" ALTER COLUMN "buyer_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Faqs_campaign_name_idx" ON "Faqs"("campaign_name");
