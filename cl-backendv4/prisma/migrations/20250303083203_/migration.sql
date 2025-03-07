/*
  Warnings:

  - A unique constraint covering the columns `[buyer_id,topic_id]` on the table `Call_scripts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Call_scripts_buyer_id_topic_id_key" ON "Call_scripts"("buyer_id", "topic_id");
