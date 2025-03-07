import { Request, Response } from 'express';

import { RegisterService } from '../../service/auth/register.service';

export const RegisterController = async (req: Request, res: Response): Promise<void> => {
    const requestInformation = req.body;

    try {
        RegisterService(requestInformation)
            .then(successMsg => res.send(successMsg))
            .catch(failedMsg => res.status(301).send(failedMsg));
    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}