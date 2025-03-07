import { Request, Response } from 'express';

import { LoginService } from '../../service/auth/login.service';

export const LoginController = async (req: Request, res: Response): Promise<void> => {
    const requestInformation = req.body;
    try {
        LoginService(requestInformation)
            .then(accessToken => res.json(accessToken))
            .catch(err => res.status(404).send(err.message));
    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}