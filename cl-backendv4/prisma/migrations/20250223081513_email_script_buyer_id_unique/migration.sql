/*
  Warnings:

  - A unique constraint covering the columns `[buyer_identifier]` on the table `EmailScript` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailScript_buyer_identifier_key" ON "EmailScript"("buyer_identifier");
