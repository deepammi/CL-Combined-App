import { Router } from 'express';
import {
    SaveNewCallController
} from '../controllers/saveNewCall.controller'

const router = Router();

router.post('/', SaveNewCallController);

export default router;