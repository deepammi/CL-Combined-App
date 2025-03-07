import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { AIQueryService } from "./AIQueryServiceFactory";
import { getAWSBedrockConfig, retryWithExponentialBackoff } from "../../utils/aws-credentials";

export interface IBedrockQueryService extends AIQueryService {
  rag(prompt: string): Promise<string>;
}

export class BedrockQueryService implements IBedrockQueryService {
  private readonly client: BedrockAgentRuntimeClient;
  private readonly modelArn =
    "arn:aws:bedrock:us-east-1:373128336056:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0";

  constructor() {
    // Initialize Bedrock Agent Runtime Client with our utility function
    try {
      this.client = new BedrockAgentRuntimeClient(getAWSBedrockConfig());
    } catch (e: any) {
      console.error("Error initializing Amazon Bedrock:", e.message);
      throw new Error("Error occurred while initializing Amazon Bedrock");
    }
  }

  async query(prompt: string): Promise<string> {
    console.log("Querying Bedrock");
    throw new Error("not implemented");
  }

  async rag(prompt: string): Promise<string> {
    console.log("Querying Bedrock RAG");
    try {
      // Use retry mechanism for AWS operations
      return await retryWithExponentialBackoff(async () => {
        const command = new RetrieveAndGenerateCommand({
          input: { text: prompt },
          retrieveAndGenerateConfiguration: {
            type: "KNOWLEDGE_BASE",
            knowledgeBaseConfiguration: {
              knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
              modelArn: this.modelArn,
            },
          },
        });
        const response = await this.client.send(command);
        return response.output?.text ?? "No result found";
      });
    } catch (e) {
      console.error("Error querying Bedrock RAG:", e);
      return "Error occurred while querying Bedrock";
    }
  }
}
