-- AlterTable
ALTER TABLE "Call_logs" ALTER COLUMN "call_id" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "BuyerList_temp" (
    "id" SERIAL NOT NULL,
    "sNo" INTEGER NOT NULL,
    "buyerIdentifier" TEXT NOT NULL,
    "fName" TEXT NOT NULL,
    "lName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "website" TEXT,
    "linkedin" TEXT,
    "location" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "industry" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "caseStudyId" INTEGER NOT NULL,
    "campaignName" TEXT NOT NULL,

    CONSTRAINT "BuyerList_temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallScript_temp" (
    "id" SERIAL NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "topicId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CallScript_temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailScript_temp" (
    "id" SERIAL NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "email1" TEXT NOT NULL,
    "email2" TEXT,
    "email3" TEXT,

    CONSTRAINT "EmailScript_temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellSideScript_temp" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "industry1" TEXT,
    "industry2" TEXT,
    "industry3" TEXT,
    "industry4" TEXT,
    "industry5" TEXT,
    "function1" TEXT,
    "function2" TEXT,
    "function3" TEXT,
    "function4" TEXT,
    "function5" TEXT,

    CONSTRAINT "SellSideScript_temp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuyerList_temp_buyerIdentifier_key" ON "BuyerList_temp"("buyerIdentifier");
