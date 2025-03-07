import { Request, Response } from 'express';

import { GetCallLogsService } from '../service/getCallLogs.service';

export const GetCallLogsController = async (req: Request, res: Response): Promise<void> => {
    const pageInformation: any = req.query;
    try {
        GetCallLogsService(pageInformation)
            .then(successMsg => res.send(successMsg))
            .catch(failedMsg => res.status(301).send(failedMsg))
        
    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}