import { BedrockQueryService } from "./aiQueryClients/bedrockQueryService";

export const AskAboutProductService = async (req?: string) => {
    try {
        if (!req) {
            throw new Error("No request body provided");
        }
        const bedrockQueryService = new BedrockQueryService();
        const result = await bedrockQueryService.rag(req as string);
        return result;
    } catch (error) {
        return error;
    }

}