import { Router } from 'express';
import {
    AskAboutProductController
} from '../controllers/askAboutProduct.controller';

const router = Router();

router.post('/', AskAboutProductController);

export default router;