import { Request, Response } from 'express';

import { saveNewCallService } from '../service/saveNewCall.service';

export const SaveNewCallController = async (req: Request, res: Response): Promise<void> => {
    try {
        let contactInformation = req.body;
        saveNewCallService(contactInformation)
            .then(successMsg => res.status(200).send(successMsg))
            .catch(failedMsg => res.status(301).send(failedMsg));
        
    } catch (e: any) {
        console.log("[ERROR]:",e);
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}