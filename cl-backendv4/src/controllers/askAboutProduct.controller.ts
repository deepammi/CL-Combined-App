import { Request, Response } from 'express';

import { AskAboutProductService } from '../service/askAboutProductService';

export const AskAboutProductController = async (req: Request, res: Response): Promise<void> => {
    const inputInformation = req.body.input;
    try {
        AskAboutProductService(inputInformation)
            .then(successMsg => {
                res.send(successMsg)
            })
            .catch(failedMsg => res.status(301).send(failedMsg))

    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}