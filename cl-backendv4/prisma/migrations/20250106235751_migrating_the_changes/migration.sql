/*
  Warnings:

  - You are about to drop the column `buyerIdentifier` on the `BuyerList_temp` table. All the data in the column will be lost.
  - You are about to drop the column `campaignName` on the `BuyerList_temp` table. All the data in the column will be lost.
  - You are about to drop the column `fName` on the `BuyerList_temp` table. All the data in the column will be lost.
  - You are about to drop the column `lName` on the `BuyerList_temp` table. All the data in the column will be lost.
  - You are about to drop the column `sNo` on the `BuyerList_temp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buyer_identifier]` on the table `BuyerList_temp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyer_identifier` to the `BuyerList_temp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaign_name` to the `BuyerList_temp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `f_name` to the `BuyerList_temp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `l_name` to the `BuyerList_temp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s_no` to the `BuyerList_temp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BuyerList_temp_buyerIdentifier_key";

-- AlterTable
ALTER TABLE "BuyerList_temp" DROP COLUMN "buyerIdentifier",
DROP COLUMN "campaignName",
DROP COLUMN "fName",
DROP COLUMN "lName",
DROP COLUMN "sNo",
ADD COLUMN     "buyer_identifier" TEXT NOT NULL,
ADD COLUMN     "campaign_name" TEXT NOT NULL,
ADD COLUMN     "f_name" TEXT NOT NULL,
ADD COLUMN     "l_name" TEXT NOT NULL,
ADD COLUMN     "s_no" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BuyerList_temp_buyer_identifier_key" ON "BuyerList_temp"("buyer_identifier");
