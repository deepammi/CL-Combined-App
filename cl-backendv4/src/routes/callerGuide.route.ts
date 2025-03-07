

import { Router } from 'express';
import { CallerGuideController } from '../controllers/callerGuide.controller';
import { EmailGuideController } from '../controllers/emailGuide.controller';

const router = Router();

router.post('/caller-guide', CallerGuideController);
router.post('/email-guide', EmailGuideController);

export default router;