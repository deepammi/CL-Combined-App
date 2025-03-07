import { OpenAI } from "openai"; // Assume OpenAI SDK is installed
import { AIQueryService } from "./AIQueryServiceFactory";
import { ChatCompletionMessageParam } from "openai/resources";

export interface IOpenAIQueryService extends AIQueryService {
  chat(messages: ChatCompletionMessageParam[]): Promise<string | undefined>;
}

export class OpenAIQueryService implements IOpenAIQueryService {
  private readonly client!: OpenAI;

  constructor() {
    try {
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (e: any) {
      console.log(e.message);
      throw new Error("Error Occured while initializing OpenAI");
    }
  }

  async query(prompt: string): Promise<string> {
    console.log("Querying OpenAI prompt");
    try {
      const response = await this.client.completions.create({
        model: "gpt-4o-mini",
        prompt: prompt,
      });
      return response.choices[0].text.trim();
    } catch (e) {
      console.error(e);
      return "Error Occured while querying OpenAI";
    }
  }

  async chat(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined> {
    console.log("Querying OpenAI chat")
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
      });
      return response.choices[0].message.content?.trim();
    } catch (e) {
      console.log(e);
      return "Error Occured while querying OpenAI";
    }
  }
}
