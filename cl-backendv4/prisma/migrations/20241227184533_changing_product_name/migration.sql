/*
  Warnings:

  - You are about to drop the column `productName` on the `CallScript_temp` table. All the data in the column will be lost.
  - Added the required column `productId` to the `CallScript_temp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallScript_temp" DROP COLUMN "productName",
ADD COLUMN     "productId" INTEGER NOT NULL;
