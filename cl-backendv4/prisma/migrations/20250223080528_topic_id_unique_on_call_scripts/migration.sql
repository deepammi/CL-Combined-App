/*
  Warnings:

  - A unique constraint covering the columns `[topic_id]` on the table `Call_scripts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Call_scripts_topic_id_key" ON "Call_scripts"("topic_id");
