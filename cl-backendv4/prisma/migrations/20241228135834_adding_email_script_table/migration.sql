-- CreateTable
CREATE TABLE "EmailScript" (
    "id" SERIAL NOT NULL,
    "buyer_identifier" INTEGER NOT NULL,
    "email1" TEXT NOT NULL,
    "email2" TEXT,
    "email3" TEXT,

    CONSTRAINT "EmailScript_pkey" PRIMARY KEY ("id")
);
