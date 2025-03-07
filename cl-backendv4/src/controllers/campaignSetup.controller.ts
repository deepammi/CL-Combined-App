import { Request, Response } from 'express';
import { CallerGuideService } from '../service/callerGuide.service';
import { aiSearchService, campaignSetupService, commitToDbService, sellerSideResearchService } from '../service/campaignSetup.service';



// This is the original code for aiResearchController when we were saving the uploaded file to disk

export const campaignSetupController = async (req: Request, res: Response): Promise<void> => {
    const { file } = req;
    try {
        campaignSetupService(file).then(successMsg => {
            res.status(successMsg.statusCode).send({
                statusCode: successMsg.statusCode,
                data: successMsg.data,  
                message: successMsg.message,
                resultantQueries: successMsg.resultantQueries
            })
        });
    } catch (e: any) {
        console.log("[ERROR]:", e);
        res.status(500).send({
            statusCode: 500,
            data: null,
            message: "Some internal server error has occured",
            resultantQueries: null
        });
    }
}

/*
// below is the code for campaignSetupController when we are saving the uploaded file to memory
const campaignSetupController = (req: Request, res: Response) => {
    try {
        const fileBuffer = req.file?.buffer;

        if (fileBuffer) {
            // Process the file data from the buffer
            const fileData = fileBuffer.toString('utf-8');
            console.log("[FILE DATA]:", fileData);
            // Perform further processing with fileData
        }

        res.send('File processed in memory');
    } catch (error) {
        console.error("[ERROR]:", error);
        res.status(500).send({
            statusCode: 500,
            data: null,
            message: "Some internal server error has occurred"
        });
    }
};
export default campaignSetupController;
*/

export const aiResearchController = async (req: Request, res: Response) : Promise<void> => {
    const { file } = req;
    try {
        console.log("[UPLOADED FILE]:", file);
        aiSearchService(file).then(successMsg => {
            console.log("[SUCCESS MESSAGE]:",successMsg);
            res.status(successMsg.statusCode).send({
                statusCode: successMsg.statusCode,
                data: successMsg.data,  
                message: successMsg.message,
                dataInsertedToTables: successMsg.dataInsertedToTables
            })
        });
    } catch (err) {
        console.log("[ERROR]:", err);
        res.status(500).send({
            statusCode: 500,
            data: null,
            message: "Some internal server error has occured"
        });
    }
}



export const committingTablesToDb = async (req: Request, res: Response) : Promise<void> => {
    try {
        commitToDbService().then(successMsg => {
            console.log("[SUCCESS MESSAGE]:",successMsg);
            res.status(successMsg?.status).send({
                status: successMsg?.status,
                message: successMsg?.message
            })
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            data: null,
            message: (err instanceof Error) ? err.message : 'An unknown error occurred'
        });
    }
}

export const sellerSideResearchController = async (req: Request, res:Response) => {
    try {
        const { file } = req;
        sellerSideResearchService(file).then(successMsg => {
            console.log("[SUCCESS MESSAGE]:",successMsg);
            res.status(successMsg?.status).send({
                status: successMsg?.status,
                message: successMsg?.message,
                data: successMsg.sellSideResults
            })
        });
    } catch (err) {
        console.log("[ERR]:",err);
        return 
    }
}
