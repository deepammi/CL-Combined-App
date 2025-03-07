import axios from "axios";
import { AIQueryService } from "./AIQueryServiceFactory";

export interface IPerplexityQueryService extends AIQueryService {
  chat(
    messages: any[],
    return_citations: boolean
  ): Promise<{ data: string; citations: string }>;
}

export class PerplexityQueryService implements IPerplexityQueryService {
  private readonly apiKey: string;
  private readonly llmTemperature: number;

  constructor(llmTemperature: number = 0.5) {
    this.apiKey = process.env.PERPLEXITY_API_KEY!;
    this.llmTemperature = llmTemperature;
  }

  async query(prompt: string): Promise<string> {
    console.log("Querying Perplexity prompt");
    try {
      const response = await axios.post(
        "https://api.perplexity.ai/v1/query",
        { prompt },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );
      return response.data.result;
    } catch (e) {
      console.error(e);
      return "Error Occured while querying Perplexity";
    }
  }

  async chat(
    messages: any[],
    return_citations: boolean = false
  ): Promise<{ data: string; citations: string }> {
    const url = "https://api.perplexity.ai/chat/completions";
    const model = "llama-3.1-sonar-small-128k-online";

    const payload = {
      model: model,
      messages: messages,
      temperature: this.llmTemperature,
      return_citations,
    };

    const headers = {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    };

    console.log("Querying Perplexity chat");

    try{

        const response: any = await axios.post(url, payload, { headers });
        return {
          data: (response.data.choices[0]?.message?.content ?? "").trim(),
          citations: response.data.citations,
        };
    }catch(e: any){
        console.error("error querying perplexity chat for", e?.response?.data?.error?.message);
        return { data: "Error Occured while querying Perplexity", citations: "Error Occured while querying Perplexity" };
    }
  }
}
