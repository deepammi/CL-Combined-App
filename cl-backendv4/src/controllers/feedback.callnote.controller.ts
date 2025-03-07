import { Request, Response } from "express";

import { FeedbackCallNoteService } from "../service/feedback.callnote.service";

export const FeedbackCallNoteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const callNotesInformation = req.body;
  try {
    FeedbackCallNoteService(callNotesInformation)
      .then((successMsg) => {
        res.send(successMsg);
      })
      .catch((failedMsg) => res.status(301).send(failedMsg));
  } catch (e: any) {
    res.status(500).send({ error: e.message, stack: e.stack });
  }
};
