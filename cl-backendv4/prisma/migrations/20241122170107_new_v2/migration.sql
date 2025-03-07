/*
  Warnings:

  - You are about to drop the `Buyer_list_temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Call_scripts_temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Camp_users_temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Campaigns_temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sell_side_scripts_temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topics_temp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users_temp` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Call_logs" ALTER COLUMN "call_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Camp_users" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Campaigns" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Feedbacks" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "Buyer_list_temp";

-- DropTable
DROP TABLE "Call_scripts_temp";

-- DropTable
DROP TABLE "Camp_users_temp";

-- DropTable
DROP TABLE "Campaigns_temp";

-- DropTable
DROP TABLE "Sell_side_scripts_temp";

-- DropTable
DROP TABLE "Topics_temp";

-- DropTable
DROP TABLE "Users_temp";
