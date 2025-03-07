import { Request, Response } from "express";

import { FeedbackService } from "../service/feedback.service";

export const FeedbackController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const feedbackInformation = req.body;
  try {
    FeedbackService(feedbackInformation)
      .then((successMsg) => {
        res.send(successMsg);
      })
      .catch((failedMsg) => res.status(301).send(failedMsg));
  } catch (e: any) {
    res.status(500).send({ error: e.message, stack: e.stack });
  }
};
