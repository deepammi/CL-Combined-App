/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Campaigns_temp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Campaigns_temp_name_key" ON "Campaigns_temp"("name");
