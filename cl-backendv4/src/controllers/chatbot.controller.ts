import { Request, Response } from 'express';

import { ChatbotService } from '../service/chatbot.service';

export const ChatbotController = async (req: Request, res: Response): Promise<void> => {
    const inputInformation = req.body.input;
    try {
        ChatbotService(inputInformation)
            .then(successMsg => {
                res.send(successMsg)
            })
            .catch(failedMsg => res.status(301).send(failedMsg))
        
    } catch (e: any) {
        res.status(500).send({ error: e.message, stack: e.stack });
    }
}