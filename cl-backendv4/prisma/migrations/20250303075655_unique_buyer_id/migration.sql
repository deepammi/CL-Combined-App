/*
  Warnings:

  - A unique constraint covering the columns `[buyer_id]` on the table `Call_scripts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Call_scripts_topic_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Call_scripts_buyer_id_key" ON "Call_scripts"("buyer_id");
