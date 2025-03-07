import { Request, Response } from 'express';

import { BuyerListService } from '../service/buyerList.service';

export const BuyerListController = async (req: Request, res: Response): Promise<void> => {
    try {
        BuyerListService()
            .then(successMsg => res.send(successMsg))
            .catch(failedMsg => res.status(301).send(failedMsg))
    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}