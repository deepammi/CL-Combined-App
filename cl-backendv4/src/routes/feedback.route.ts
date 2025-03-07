import { Router } from "express";
import { FeedbackController } from "../controllers/feedback.controller";
import { FeedbackCallNoteController } from "../controllers/feedback.callnote.controller";

const router = Router();

router.post("/", FeedbackController);
router.post("/call-notes", FeedbackCallNoteController);

export default router;
