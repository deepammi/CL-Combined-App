import { AiProvider, AiStrategy } from "../AIGenService";
import { BedrockQueryService } from "./bedrockQueryService";
import { OpenAIQueryService } from "./openAIQueryService";
import { PerplexityQueryService } from "./perplexityQueryService";

export class AIQueryServiceFactory {
  private static instances: Map<string, AIQueryService> = new Map();


  private constructor(){}

  static get(provider: AiProvider) {
    if (!AIQueryServiceFactory.instances.get(provider)) {
      if (provider === "perplexity") {
        AIQueryServiceFactory.instances.set(
          provider,
          new PerplexityQueryService()
        );
      } else if(provider === "openai") {
        AIQueryServiceFactory.instances.set(provider, new OpenAIQueryService());
      }else {
        AIQueryServiceFactory.instances.set(provider, new BedrockQueryService());
      }
    }
    return AIQueryServiceFactory.instances.get(provider)!;
  }
}

export interface AIQueryService {
  query(prompt: string): Promise<string>;
}
