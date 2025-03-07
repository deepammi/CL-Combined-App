import { Router } from 'express';
import {
    BuyerListController
} from '../controllers/buyerList.controller';
import { emailDraftUpdateController } from '../controllers/emailDraftUpdate.controller';

const router = Router();

router.get('/', BuyerListController);
router.put('/', emailDraftUpdateController);

export default router;