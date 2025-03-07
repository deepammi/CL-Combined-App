import { Request, Response } from 'express';
// import { CallerGuideService } from '../service/callerGuide.service';
import { EmailGuideService } from '../service/emailGuide.service';


export const EmailGuideController = async (req: Request, res: Response): Promise<void> => {
    const { context } = req.body;

    console.log("[CONTEXT]:",context);
    try {
        EmailGuideService(context).then(successMsg => {
            console.log("[SUCCESS MESSAGE OBJECT]:", successMsg);
            res.status(successMsg.statusCode).send({
                statusCode: successMsg.statusCode,
                data: successMsg.data,
                message: successMsg.message
            })
        });
    } catch (e: any) {
        console.log("[ERROR]:",e);
        res.status(500).send({
            statusCode:500,
            data: null,
            message: "Some internal server error has occured"
        });
    }
}