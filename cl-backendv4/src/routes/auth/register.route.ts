import { Router } from 'express';
import {
    RegisterController
} from '../../controllers/auth/register.controller'

const router = Router();

router.post('/', RegisterController);

export default router;