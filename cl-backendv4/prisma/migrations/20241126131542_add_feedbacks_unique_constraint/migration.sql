/*
  Warnings:

  - A unique constraint covering the columns `[call_script_id,topic_id,user_email]` on the table `Feedbacks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Feedbacks_call_script_id_topic_id_user_email_key" ON "Feedbacks"("call_script_id", "topic_id", "user_email");
