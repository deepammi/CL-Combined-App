/*
  Warnings:

  - Made the column `roleId` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roleId` on table `Users_temp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "Users" SET "roleId" = (SELECT id FROM "Role" WHERE name = 'Viewer' LIMIT 1);
UPDATE "Users_temp" SET "roleId" = (SELECT id FROM "Role" WHERE name = 'Viewer' LIMIT 1);
-- AlterTable
ALTER TABLE "Users_temp" ALTER COLUMN "roleId" SET NOT NULL;
