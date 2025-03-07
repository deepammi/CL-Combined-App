import { Router } from 'express';
import {
    LoginController
} from '../../controllers/auth/login.controller'

const router = Router();

router.post('/', LoginController);

export default router;