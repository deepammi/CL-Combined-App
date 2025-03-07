-- CreateTable
CREATE TABLE "Campaigns_temp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_site" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_category" TEXT NOT NULL,
    "vertical_1" TEXT,
    "vertical_2" TEXT,
    "vertical_3" TEXT,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaigns_temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users_temp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_hint" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camp_users_temp" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "user_queueID" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Camp_users_temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topics_temp" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "topic_identifier" TEXT NOT NULL,

    CONSTRAINT "Topics_temp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_temp_email_key" ON "Users_temp"("email");
