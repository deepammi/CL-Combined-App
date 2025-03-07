import prisma from "../prisma";

export const FeedbackCallNoteService = async (req: {
  values: boolean[];
  titles: string[];
  note: string;
  user_email: string;
}) => {
  try {
    // Process each value and title
    for (let index = 0; index < req.values.length; index++) {
      const value = req.values[index];
      const title = req.titles[index];
      
      // Find the topic by title
      const topics = await prisma.topics.findMany({
        where: {
          title: title,
        },
        take: 1,
      });
      
      const topic = topics.length > 0 ? topics[0] : null;

      if (!topic) {
        console.error(`Topic not found: ${title}`);
        continue;
      }

      // Create or update feedback
      await prisma.feedbacks.upsert({
        where: {
          // Unique identifier combining the fields
          call_script_id_topic_id_user_email: {
            call_script_id: 1,
            topic_id: topic.id,
            user_email: req.user_email,
          },
        },
        update: {
          // Update the fields when the record exists
          section_title: topic.title,
          comment: value ? "Y" : "N",
          flag: value,
        },
        create: {
          // Create a new record when no match is found
          call_script_id: 1,
          topic_id: topic.id,
          section_title: topic.title,
          user_email: req.user_email,
          comment: value ? "Y" : "N",
          flag: value,
        },
      });
    }

    // Process call notes
    const callNotesTopics = await prisma.topics.findMany({
      where: {
        title: "call_notes",
      },
      take: 1,
    });
    
    const callNotesTopic = callNotesTopics.length > 0 ? callNotesTopics[0] : null;

    if (!callNotesTopic) {
      console.error("Call notes topic not found");
      return Promise.resolve("Success with warnings: Call notes topic not found");
    }

    // Create or update call notes feedback
    await prisma.feedbacks.upsert({
      where: {
        // Unique identifier combining the fields
        call_script_id_topic_id_user_email: {
          call_script_id: 1,
          topic_id: callNotesTopic.id,
          user_email: req.user_email,
        },
      },
      update: {
        // Update the fields when the record exists
        section_title: callNotesTopic.title,
        comment: req.note,
      },
      create: {
        // Create a new record when no match is found
        call_script_id: 1,
        topic_id: callNotesTopic.id,
        section_title: callNotesTopic.title,
        user_email: req.user_email,
        comment: req.note,
      },
    });

    return Promise.resolve("Success");
  } catch (error: any) {
    console.error("Error in FeedbackCallNoteService:", error);
    return Promise.reject({ message: error.message || "An unknown error occurred" });
  }
};
