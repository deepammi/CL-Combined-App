-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "roleId" INTEGER;

-- AlterTable
ALTER TABLE "Users_temp" ADD COLUMN     "roleId" INTEGER;

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Role" ("name", "createdAt", "updatedAt") 
VALUES 
    ('Admin', NOW(), NOW()), 
    ('Viewer', NOW(), NOW());


-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
