/**
 * This service is responsible for fetching data from Feedbacks in the S3 bucket.
 * This ensures that feedback records are either updated if they exist or created if they don't, based on the unique combination of call_script_id, topic_id, and user_email.
 */

import prisma from "../prisma";

export const FeedbackService = async (req: {
  call_script_id: number;
  topic_id: number;
  section_title: string;
  user_email: string;
  comment: string;
  flag: boolean;
}) => {
  try {
    const result: any = await prisma.feedbacks.upsert({
      where: {
        // Unique identifier combining the fields
        call_script_id_topic_id_user_email: {
          call_script_id: req.call_script_id,
          topic_id: req.topic_id,
          user_email: req.user_email,
        },
      },
      update: {
        // Update the fields when the record exists
        section_title: req.section_title,
        comment: req.comment,
        flag: req.flag,
      },
      create: {
        // Create a new record when no match is found
        call_script_id: req.call_script_id,
        topic_id: req.topic_id,
        section_title: req.section_title,
        user_email: req.user_email,
        comment: req.comment,
        flag: req.flag,
      },
    });
    if (!result) {
      return Promise.reject({ message: "Not Found" });
    } else return Promise.resolve(result);
  } catch (error) {
    return Promise.reject({ message: error });
  }
};
