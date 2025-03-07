import { Request, Response } from 'express';

import { FetchDataTypeService } from '../service/fetchDataType.service';

export const FetchDataTypeController = async (req: Request, res: Response): Promise<void> => {
    try {
        let modeInformation = req.body.mode;
        FetchDataTypeService(modeInformation)
            .then(successMsg => res.status(200).send({status: 200, message: successMsg}))
            .catch(failedMsg => res.status(301).send(failedMsg))
        
    } catch (e: any) {
        res.status(500).send({status: 500, error: e.message, stack: e.stack });
    }
}       