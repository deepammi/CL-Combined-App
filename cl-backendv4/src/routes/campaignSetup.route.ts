

import { Router } from 'express';
import { CallerGuideController } from '../controllers/callerGuide.controller';
import { EmailGuideController } from '../controllers/emailGuide.controller';
import { aiResearchController, campaignSetupController, committingTablesToDb, sellerSideResearchController } from '../controllers/campaignSetup.controller';
import multer from "multer";

const router = Router();


// this was original code to save uploaded data to disk - now we are saving it to memory
const storage = multer.memoryStorage();

//const storage = multer.memoryStorage(); //remove this line if enabling disk storage

const upload = multer({ storage: storage });

router.post('/campaign-setup',upload.single("file"), campaignSetupController);
router.post('/ai-research',upload.single("file"), aiResearchController);
router.post('/commit-to-db', committingTablesToDb);
router.post('/seller-side-research',upload.single("file"), sellerSideResearchController);

export default router;