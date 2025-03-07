import axios from "axios";
import {
  BedrockQueryService,
  OpenAIQueryService,
  PerplexityQueryService,
} from "./aiQueryClients";

import { createThrottledFunction } from "./aiQueryClients/QueueThrottler";

export type AiProvider = "perplexity" | "openai" | "bedrock";

export type AiStrategy = "perplexity" | "openai";

interface BedrockQueryResult {
  caseStudy: string;
  valueProp: string;
}

interface ConductWebQueryResult {
  response: string;
  citations: string;
}

interface GenerateEmailDraftsResult {
  emailDraftPas: string;
  emailDraftAida: string;
  emailDraftFab: string;
  draftLinkedinMessage1: string;
  draftLinkedinMessage2: string;
}

async function _conductOpenAIPasEmailQuery(
  this: { _openAiClient: OpenAIQueryService },
  campaignData: { companyName: string; ProductCategory: string },
  prospectData: {
    titleVerified: boolean;
    f_name: string;
    l_name: string;
    title: string;
    company: string;
    func: string;
    industry: string;
  },
  caseStudyResults: { caseStudy: string; valueProp: string },
  buySideQuestionsResponse: {
    personalFacts: string;
    jobChallenges: string;
    companyNews: string;
    companyPriorities: string;
    companyValues: string;
    personalFactsCitations: string[];
    jobChallengesCitations: string[];
    companyNewsCitations: string[];
    companyPrioritiesCitations: string[];
    companyValuesCitations: string[];
  }
) {
  // Base query structure
  let query = `Generate an email of 200 words or less from the Sender to a customer. The Sender is the Co-founder of ${campaignData.companyName}, and the customer is ${prospectData.f_name} ${prospectData.l_name}.`;

  if (prospectData.titleVerified) {
    query += `, the ${prospectData.title} of ${prospectData.company}.`;
  }

  query += `
    The email format should strictly follow these steps:
    1. Create a personalized salutory greeting${
      prospectData.titleVerified
        ? ` using the following customer information: ${buySideQuestionsResponse.personalFacts}`
        : ""
    }.
    2. Mention that you are an ex-AI leader from Microsoft who had the chance to work with ${
      prospectData.company
    }.
    3. State that 74% of companies today are not finding AI viable and are missing out on strategic opportunities.
    4. Explain that you left Microsoft to help companies like ${
      prospectData.company
    } make AI profitable through improved accuracy and drastic cost reduction.
    5. Describe how ${
      campaignData.companyName
    } has helped similar customers, using this case study: ${
    caseStudyResults.caseStudy
  }.
    6. Mention that Nolij is the first to build industry-specific Agents using small open-source models like Llama and DeepSeek.
    7. Conclude the email by inviting the customer to a call next Tuesday or Friday.
  `;

  // Adjust query if no personal facts are found
  if (
    prospectData.titleVerified &&
    /nothing found/i.test(buySideQuestionsResponse.personalFacts)
  ) {
    query = query.replace(
      `using the following customer information: ${buySideQuestionsResponse.personalFacts}`,
      `by praising the customer for their role as ${prospectData.title} of ${prospectData.company}`
    );
  }

  try {
    const emailContent = await this._openAiClient.chat([
      { role: "user", content: query },
    ]);
    return emailContent?.replace(/recently|recent/gi, "");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on api call", error.message);
    } else {
      console.error("OpenAI API call failed:", error);
    }
    return "Error generating email. Please try again later.";
  }
}

async function _conductOpenAIAIDAEmailQuery(
  this: { _openAiClient: OpenAIQueryService },
  campaignData: { companyName: string; ProductCategory: string },
  prospectData: {
    titleVerified: boolean;
    f_name: string;
    l_name: string;
    title: string;
    company: string;
    func: string;
    industry: string;
  },
  caseStudyResults: { caseStudy: string; valueProp: string },
  buySideQuestionsResponse: {
    personalFacts: string;
    jobChallenges: string;
    companyNews: string;
    companyPriorities: string;
    companyValues: string;
    personalFactsCitations: string[];
    jobChallengesCitations: string[];
    companyNewsCitations: string[];
    companyPrioritiesCitations: string[];
    companyValuesCitations: string[];
  }
) {
  // Construct the base email query
  let query = `
    Generate an email of 200 words or less from the Co-founder of ${
      campaignData.companyName
    } 
    to the customer ${prospectData.f_name} ${prospectData.l_name}${
    prospectData.titleVerified
      ? `, the ${prospectData.title} of ${prospectData.company}`
      : ""
  }.
    
    The email should follow these steps:
    1. Create a personalized greeting reminding the customer you are following up on an earlier email.
    2. ${
      buySideQuestionsResponse.companyNews.includes("nothing found")
        ? `Highlight a business priority or core value of ${prospectData.company} using this context: ${buySideQuestionsResponse.companyPriorities}.`
        : `If relevant, mention customer company news: ${buySideQuestionsResponse.companyNews}.`
    }
    3. Mention that 75% of companies in the ${
      prospectData.industry
    } industry are yet to generate profits using AI.
    4. Summarize how ${
      campaignData.companyName
    } helps similar customers using this information: ${
    caseStudyResults.valueProp
  }.
    5. State that Nolij is the first to build industry-specific Agents using small open-source models like Llama and DeepSeek.
    6. Conclude by inviting the customer to a call next Tuesday or Thursday.
  `;

  try {
    const response = await this._openAiClient.chat([
      { role: "user", content: query.trim() },
    ]);

    return response ?? "No response generated.";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on api call", error.message);
    } else {
      console.error("OpenAI API Error:", error);
    }
    return "Error generating email. Please try again.";
  }
}

async function _conductOpenAIFABEmailQuery(
  this: { _openAiClient: OpenAIQueryService },
  campaignData: { companyName: string; ProductCategory: string },
  prospectData: {
    titleVerified: boolean;
    f_name: string;
    l_name: string;
    title: string;
    company: string;
    func: string;
    industry: string;
  },
  caseStudyResults: { caseStudy: string; valueProp: string },
  buySideQuestionsResponse: {
    personalFacts: string;
    jobChallenges: string;
    companyNews: string;
    companyPriorities: string;
    companyValues: string;
    personalFactsCitations: string[];
    jobChallengesCitations: string[];
    companyNewsCitations: string[];
    companyPrioritiesCitations: string[];
    companyValuesCitations: string[];
  }
) {
  // Construct email query based on the provided parameters
  let query = `
    Generate an email of 200 words or less, from the Sender to a customer. 
    The Sender is the Head of Partnerships at ${
      campaignData.companyName
    } and the customer is ${prospectData.f_name} ${prospectData.l_name}${
    prospectData.titleVerified
      ? `, the ${prospectData.title} of ${prospectData.company}`
      : ""
  }.
    The email format should strictly follow the following instructions:
    Step 1: create a personalized greeting using this context: ${
      buySideQuestionsResponse.companyValues
    }
    Step 2: mention that you are following up to your earlier mail
    Step 3: in one sentence highlight a business priority or core value of ${
      prospectData.company
    } using this context: ${buySideQuestionsResponse.companyPriorities}
    Step 4: in one sentence mention how ${
      campaignData.companyName
    } is making AI profitable using this case study: ${
    caseStudyResults.caseStudy
  }
    Step 5: conclude by inviting the customer to a call next Wednesday or Friday`;

  // Adjust the query if 'nothing' is found in companyValues
  if (buySideQuestionsResponse.companyValues.includes("nothing")) {
    query = `
      Generate an email of 200 words or less, from the Sender to a customer. 
      The Sender is the Head of Partnerships at ${
        campaignData.companyName
      } and the customer is ${prospectData.f_name} ${prospectData.l_name}${
      prospectData.titleVerified
        ? `, the ${prospectData.title} of ${prospectData.company}`
        : ""
    }.
      The email format should strictly follow the following instructions:
      Step 1: create a personalized greeting and mention that you are following up to your earlier email
      Step 2: in one sentence highlight a business priority or core value of ${
        prospectData.company
      } using this context: ${buySideQuestionsResponse.companyPriorities}
      Step 3: in one sentence mention how ${
        campaignData.companyName
      } is making AI profitable using this case study: ${
      caseStudyResults.caseStudy
    }
      Step 4: conclude by inviting the customer to a call next Wednesday or Friday`;
  }

  try {
    // Call the OpenAI API to generate the email
    const response = await this._openAiClient.chat([
      { role: "user", content: query },
    ]);
    return response?.replace(/\b(recently|recent)\b/g, "");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on api call", error.message);
    } else {
      console.error("OpenAI API Error:", error);
    }
    return "Error generating email. Please try again.";
  }
}

async function _generateEmailDraft(
  queryFunction: Function,
  campaignData: { companyName: string; ProductCategory: string },
  prospectData: {
    titleVerified: boolean;
    f_name: string;
    l_name: string;
    title: string;
    company: string;
    func: string;
    industry: string;
  },
  caseStudyResults: { caseStudy: string; valueProp: string },
  buySideQuestionsResponse: {
    personalFacts: string;
    jobChallenges: string;
    companyNews: string;
    companyPriorities: string;
    companyValues: string;
    personalFactsCitations: string;
    jobChallengesCitations: string;
    companyNewsCitations: string;
    companyPrioritiesCitations: string;
    companyValuesCitations: string;
  },
  citations: string[]
): Promise<string> {
  // Generate email draft by calling the provided query function
  let emailDraft = await queryFunction(
    campaignData,
    prospectData,
    caseStudyResults,
    buySideQuestionsResponse
  );

  // Append citations to the email draft
  if (citations && citations.length > 0) {
    emailDraft += `\n\nResearch References:\n${citations.join("\n")}`;
  }

  return emailDraft;
}

async function _conductOpenaiLinkedinQuery(
  this: { _openAiClient: OpenAIQueryService },
  prospectData: {
    titleVerified: boolean;
    f_name: string;
    l_name: string;
    title: string;
    company: string;
    func: string;
    industry: string;
  },
  companyPriorities: string,
  genericFlag: boolean = false
): Promise<string> {
  // If no priorities are provided, return a generic message
  if (companyPriorities.includes("nothing") && genericFlag === true) {
    return "use other message";
  }

  // If company priorities are empty, return a generic message
  if (companyPriorities.includes("nothing")) {
    const responseContent = `Hi ${prospectData.f_name}, I got familiar with your inspiring AI work during my stint at Microsoft. \
                  I’d love to connect and share insights as I scale my own business in Industrial Agents that make AI more accurate and 90% lower cost.\
                  Looking forward to connecting.`;
    return responseContent;
  }
  // Construct the query with useful content from company priorities
  const query = `Generate a LinkedIn connect message strictly less than 250 characters to customer ${prospectData.f_name}. \
                  The message should strictly follow the following instructions. \
                  Step 1: say that I got familiar with your inspiring AI work related to ${companyPriorities} during my stint at Microsoft. \
                  Step 2: say that I would like to share insights as I scale my own business in Industrial Agents that make AI more accurate and 90% lower cost.`;

  // Call OpenAI API with the query
  const response = await this._openAiClient.chat([
    {
      role: "user",
      content: query,
    },
  ]);

  return response?.replace(/recently|recent/gi, "") ?? "";
}

async function conductBedrockQueryRag(
  this: { _bedrockClient: BedrockQueryService },
  sellerCompany: string,
  industry: string,
  func: any,
  title: string
): Promise<BedrockQueryResult> {
  // Case Study Prompt
  const caseStudyPrompt = `Summarize in 2 sentences a customer success case study when ${sellerCompany} helped a customer who is the ${title} in the ${industry} industry. Include any quantifiable customer impact in your response. If you do not find a case study from the same industry, simply say nothing found`;
  const caseStudy = await this._bedrockClient.rag(caseStudyPrompt);

  // Value Proposition Prompt
  const valuePropPrompt = `What products or services can ${sellerCompany} offer to a customer who is the ${title} in the ${industry} industry? Summarize your answer in 2 sentences and name relevant products and services offered by ${sellerCompany}`;
  const valueProp = await this._bedrockClient.rag(valuePropPrompt);

  return { caseStudy, valueProp };
}

async function verifyBuyerTitle(
  this: { _strategy: AiStrategy; _perplexityClient: PerplexityQueryService },
  fName: string,
  lName: string,
  buyerCompany: string,
  linkedinUrl: string,
  title: string,
  llmTemperature: number = 0.5
): Promise<boolean> {
  // else: Create OpenAI query code here later

  const messages = [
    {
      role: "system",
      content:
        "You are an artificial intelligence web-search assistant. Your role is to search the web to verify the job title of the person provided.",
    },
    {
      role: "user",
      content: `Conduct a web query to respond in True or False. Is ${fName}, ${lName} with LinkedIn profile ${linkedinUrl} having a job title ${title} at ${buyerCompany} company? Answer in one word only: true or false, and do not provide any details.`,
    },
  ];

  const response = await this._perplexityClient.chat(messages, false);
  return response.data.toLowerCase() === "true";
}

async function conductWebQuery(
  this: { _strategy: AiStrategy; _perplexityClient: PerplexityQueryService },
  query: string,
  llm_temperature: number = 0.5
): Promise<ConductWebQueryResult> {
  const messages = [
    {
      role: "system",
      content:
        "You are an artificial intelligence research assistant to sales executives. Your role is to search information from websites and summarize all answers in one sentence of less than 100 words. Return {NOT FOUND} if no results.",
    },
    {
      role: "user",
      content: query,
    },
  ];

  try {
    const response = await this._perplexityClient.chat(messages, true);

    const assistantReply = response.data;
    const assistantCitations = response.citations || "No Citations Returned";

    return { response: assistantReply, citations: assistantCitations };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on api call", error.message);
    } else {
      console.error("Error:", error);
    }
    return {
      response: "LLm error, no response returned",
      citations: "LLm error, no citations returned",
    };
  }
}

async function verifyWebQuery(
  this: { _strategy: AiStrategy; _perplexityClient: PerplexityQueryService },
  query: string,
  validity_date: string,
  llm_temperature = 0.5
): Promise<boolean> {
  const query1 =
    validity_date === "Irrelevant"
      ? "Conduct a web search to answer in one word without giving any details, if this statement is likely true or false:"
      : `Check if this following statement is likely true or false and dated later than ${validity_date}. Respond in one word only:`;

  const messages = [
    {
      role: "system",
      content:
        "You are an artificial intelligence web-search assistant. Your role is to search the web to validate or reject a given statement.",
    },
    {
      role: "user",
      content: query1 + query,
    },
  ];

  try {
    const response = await this._perplexityClient.chat(messages, false);

    return response?.data.toLowerCase().includes("true") ?? false;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on api call", error.message);
    }
    console.error("Error:", error);
    return false;
  }
}

async function acceptResponse(response: any): Promise<boolean> {
  const rejectionKeywords = [
    "no ",
    "not found ",
    "not ",
    "Not ",
    "Nothng",
    "othng ",
    "ot found",
    " shares",
    " stock",
    "public offering",
    "IPO",
  ];

  return !rejectionKeywords.some((keyword) => response.includes(keyword));
}

async function generateEmailDrafts(
  this: any,
  campaignData: {
    companyName: string;
    ProductCategory: string;
  },
  prospectData: {
    titleVerified: boolean;
    f_name: string;
    l_name: string;
    title: string;
    company: string;
    func: string;
    industry: string;
  },
  caseStudyResults: { caseStudy: string; valueProp: string },
  buySideQuestionsResponse: {
    personalFacts: string;
    jobChallenges: string;
    companyNews: string;
    companyPriorities: string;
    companyPriorities1: string;
    companyPriorities2: string;
    companyValues: string;
    personalFactsCitations: string;
    jobChallengesCitations: string;
    companyNewsCitations: string;
    companyPrioritiesCitations: string;
    companyValuesCitations: string;
  }
): Promise<GenerateEmailDraftsResult> {
  const pasCitations = [
    buySideQuestionsResponse.personalFactsCitations,
    buySideQuestionsResponse.jobChallengesCitations,
  ];

  const emailDraftPas = await _generateEmailDraft(
    _conductOpenAIPasEmailQuery.bind(this),
    campaignData,
    prospectData,
    caseStudyResults,
    buySideQuestionsResponse,
    pasCitations
  );

  const aidaCitations = [
    buySideQuestionsResponse.companyPrioritiesCitations,
    buySideQuestionsResponse.companyNewsCitations,
  ];

  const emailDraftAida = await _generateEmailDraft(
    _conductOpenAIAIDAEmailQuery.bind(this),
    campaignData,
    prospectData,
    caseStudyResults,
    buySideQuestionsResponse,
    aidaCitations
  );

  const fabCitations = [
    buySideQuestionsResponse.companyPrioritiesCitations,
    buySideQuestionsResponse.companyValuesCitations,
  ];

  const emailDraftFab = await _generateEmailDraft(
    _conductOpenAIFABEmailQuery.bind(this),
    campaignData,
    prospectData,
    caseStudyResults,
    buySideQuestionsResponse,
    fabCitations
  );

  const linkedinMessage1 = await _conductOpenaiLinkedinQuery.bind(this)(
    prospectData,
    buySideQuestionsResponse.companyPriorities1
  );

  const linkedinMessage2 = await _conductOpenaiLinkedinQuery.bind(this)(
    prospectData,
    buySideQuestionsResponse.companyPriorities2
  );

  return {
    emailDraftPas,
    emailDraftAida,
    emailDraftFab,
    draftLinkedinMessage1: linkedinMessage1,
    draftLinkedinMessage2: linkedinMessage2,
  };
}

export const AiService = (
  openApiClient: OpenAIQueryService,
  perplexityClient: PerplexityQueryService,
  bedrockClient: BedrockQueryService,
  aiStrategy: AiStrategy,
  isDEV: boolean
): {
  _strategy: AiStrategy;
  _bedrockClient: BedrockQueryService;
  _perplexityClient: PerplexityQueryService;
  _openAiClient: OpenAIQueryService;
  conductBedrockQueryRag: (...params: any[]) => Promise<any>;
  verifyBuyerTitle: (...params: any[]) => Promise<any>;
  conductWebQuery: (...params: any[]) => Promise<any>;
  verifyWebQuery: (...params: any[]) => Promise<any>;
  acceptOrRejectResponse: (...params: any[]) => Promise<any>;
  generateEmailDrafts: (...params: any[]) => Promise<any>;
} => {
  if (isDEV) {
    return {
      _strategy: Object.freeze(aiStrategy),
      _bedrockClient: {} as BedrockQueryService,
      _perplexityClient: {} as PerplexityQueryService,
      _openAiClient: {} as OpenAIQueryService,
      conductBedrockQueryRag: (..._params: any[]) =>
        Promise.resolve({
          caseStudy: "dummy case study output",
          valueProp: "dummy value prop output",
        }),
      verifyBuyerTitle: (..._params: any[]) => Promise.resolve(true),
      conductWebQuery: (...params: any[]) =>
        Promise.resolve({
          response: "dummy response",
          citations: "dummy citations",
        }),
      verifyWebQuery: (...params: any[]) => Promise.resolve(true),
      acceptOrRejectResponse: (...params: any[]) => Promise.resolve(true),
      generateEmailDrafts: (...params: any[]) =>
        Promise.resolve({
          emailDraftPas: "dummy email PAS",
          emailDraftAida: "dummy email AIDA",
          emailDraftFab: "dummy email FAB",
          draftLinkedinMessage1: "dummy LinkedIn message 1",
          draftLinkedinMessage2: "dummy LinkedIn message 2",
        }),
    };
  }
  return {
    _strategy: Object.freeze(aiStrategy),
    _bedrockClient: bedrockClient,
    _perplexityClient: perplexityClient,
    _openAiClient: openApiClient,
    conductBedrockQueryRag: createThrottledFunction(conductBedrockQueryRag, 3),
    verifyBuyerTitle: createThrottledFunction(verifyBuyerTitle, 3),
    conductWebQuery: createThrottledFunction(conductWebQuery, 3),
    verifyWebQuery: createThrottledFunction(verifyWebQuery, 3),
    acceptOrRejectResponse: acceptResponse,
    generateEmailDrafts: createThrottledFunction(generateEmailDrafts, 3),
  };
};
