import { Router } from 'express';
import {
    GetCallLogsController
} from '../controllers/getCallLogs.controller';

const router = Router();

router.get('/', GetCallLogsController);

export default router;