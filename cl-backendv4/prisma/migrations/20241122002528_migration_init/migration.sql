-- CreateTable
CREATE TABLE "Buyer_list" (
    "id" SERIAL NOT NULL,
    "s_no" INTEGER,
    "campaign_name" TEXT NOT NULL,
    "buyer_identifier" TEXT NOT NULL,
    "linkedin" TEXT,
    "f_name" TEXT,
    "l_name" TEXT,
    "company" TEXT,
    "website" TEXT NOT NULL,
    "title" TEXT,
    "location" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "industry" TEXT,
    "function" TEXT,

    CONSTRAINT "Buyer_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer_list_temp" (
    "id" BIGINT,
    "linkedin" TEXT,
    "f_name" TEXT,
    "l_name" TEXT,
    "company" TEXT,
    "website" TEXT,
    "title" TEXT,
    "location" TEXT,
    "email" DOUBLE PRECISION,
    "phone" BIGINT,
    "industry" TEXT,
    "function" TEXT,
    "campaign_name" TEXT,
    "buyer_identifier" TEXT
);

-- CreateTable
CREATE TABLE "Call_logs" (
    "id" SERIAL NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "call_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "record_fetched" BOOLEAN NOT NULL DEFAULT false,
    "transcript" TEXT,
    "call_recording" TEXT,
    "call_id" VARCHAR(50),

    CONSTRAINT "Call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call_scripts" (
    "id" SERIAL NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "topic_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Call_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call_scripts_temp" (
    "buyer_id" TEXT,
    "product_id" BIGINT,
    "topic_id" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Camp_users" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "user_queueID" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Camp_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camp_users_temp" (
    "user_email" TEXT,
    "campaign_name" TEXT,
    "user_queueID" TEXT,
    "created_at" TIMESTAMP(6)
);

-- CreateTable
CREATE TABLE "Campaigns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_site" TEXT NOT NULL,
    "product_id" INTEGER,
    "product_name" TEXT,
    "product_category" TEXT NOT NULL,
    "vertical_1" TEXT,
    "vertical_2" TEXT,
    "vertical_3" TEXT,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaigns_temp" (
    "name" TEXT,
    "company_name" TEXT,
    "company_site" TEXT,
    "product_id" BIGINT,
    "product_name" TEXT,
    "product_category" TEXT,
    "vertical_1" TEXT,
    "vertical_2" TEXT,
    "vertical_3" TEXT,
    "active" BOOLEAN,
    "created_at" TIMESTAMP(6)
);

-- CreateTable
CREATE TABLE "Faqs" (
    "id" SERIAL NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "faq_no" INTEGER NOT NULL,
    "faq_question" TEXT,
    "faq_answer" TEXT,

    CONSTRAINT "Faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedbacks" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "section_title" TEXT,
    "flag" BOOLEAN,
    "user_email" TEXT NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "call_script_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sell_side_scripts" (
    "id" SERIAL NOT NULL,
    "category" TEXT,
    "topic_id" TEXT,
    "product_id" INTEGER NOT NULL,
    "industry_1" TEXT,
    "industry_2" TEXT,
    "industry_3" TEXT,
    "industry_4" TEXT,
    "industry_5" TEXT,
    "function_1" TEXT,
    "function_2" TEXT,
    "function_3" TEXT,
    "function_4" TEXT,
    "function_5" TEXT,

    CONSTRAINT "Sell_side_scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sell_side_scripts_temp" (
    "category" TEXT,
    "topic_id" TEXT,
    "product_id" BIGINT,
    "industry_1" TEXT,
    "industry_2" TEXT,
    "industry_3" TEXT,
    "industry_4" TEXT,
    "industry_5" TEXT,
    "function_1" TEXT,
    "function_2" TEXT,
    "function_3" TEXT,
    "function_4" TEXT,
    "function_5" TEXT
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "topic_identifier" TEXT NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topics_temp" (
    "title" TEXT,
    "category" TEXT,
    "detail" TEXT,
    "topic_identifier" TEXT
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_hint" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users_temp" (
    "email" TEXT,
    "password" TEXT,
    "password_hint" TEXT,
    "created_at" TIMESTAMP(6)
);

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_list_buyer_identifier_key" ON "Buyer_list"("buyer_identifier");

-- CreateIndex
CREATE INDEX "Call_logs_buyer_id_idx" ON "Call_logs"("buyer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Campaigns_name_key" ON "Campaigns"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sell_side_scripts_key" ON "Sell_side_scripts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Topics_topic_identifier_key" ON "Topics"("topic_identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
