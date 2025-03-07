import { Router } from 'express';
import {
    FetchDataTypeController
} from '../controllers/fetchDataType.controller';

const router = Router();

router.post('/', FetchDataTypeController);

export default router;