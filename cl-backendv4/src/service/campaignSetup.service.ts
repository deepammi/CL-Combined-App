/** Contains commitToDbService function that pulls data from the Temp tables and commits them to permanent tables to the database. */
/* Contains conductPerplexityQuery function that queries the Perplexity API with a list of messages and returns the response. */

import * as XLSX from "xlsx";
import axios, { HttpStatusCode } from "axios";
import AWS from "aws-sdk";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { AiService, AiStrategy } from "./AIGenService";
import { isDev } from "../utils/environment";
import {
  AIQueryServiceFactory,
  BedrockQueryService,
  OpenAIQueryService,
  PerplexityQueryService,
} from "./aiQueryClients";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { getAWSCredentials, getAWSBedrockConfig, retryWithExponentialBackoff } from "../utils/aws-credentials";

// Use AWS credentials utility instead of direct config update
const credentials = getAWSCredentials();
const AWS_REGION = credentials.region;
const BEDROCK_MODEL_ARN =
  "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2";

const AI_STRATEGY: AiStrategy = "perplexity";

const openAIQueryService = AIQueryServiceFactory.get("openai");
const bedrockQueryService = AIQueryServiceFactory.get("bedrock");
const perplexityQueryService = AIQueryServiceFactory.get("perplexity");

type MarketFocus = {
  Industries: string[];
  Functions: string[];
};

type CampaignDetails = {
  "Campaign Name": string;
  "Company Name": string;
  "Company Website": string;
  "Product Name": string;
  "Product id": number;
  "Product Category": string;
  "Product Subcategory 1": string;
  "Product Subcategory 2": string;
  "Product Subcategory 3": string;
};

type CampaignSetupData = {
  CampaignDetails: CampaignDetails;
  MarketFocus: MarketFocus;
};

interface UserRow {
  user_email: string;
  password?: string;
  password_hint?: string;
}

interface CampaignUserRow {
  user_email: string;
  user_queueID: string;
}

interface TopicRow {
  title: string;
  category: string;
  detail: string;
}

interface CampaignRow {
  name: string;
  company_name: string;
  company_site: string;
  product_id: string;
  product_name: string;
  product_category: string;
  vertical_1: string;
  vertical_2: string;
  vertical_3: string;
}

interface ParsedUser {
  email: string;
  password: string;
  password_hint: string | null;
  created_at: Date;
}

interface ParsedCampUser {
  user_email: string;
  campaign_name: string;
  user_queueID: string;
  created_at: Date;
}

interface ParsedTopic {
  title: string;
  category: string;
  detail: string;
  topic_identifier: string;
}

interface ParsedCampaign {
  name: string;
  company_name: string;
  company_site: string;
  product_id: number;
  product_name: string;
  product_category: string;
  vertical_1: string;
  vertical_2: string;
  vertical_3: string;
  active: boolean;
  created_at: Date;
}

export type TempDBModel =
  | typeof prisma.buyerList_temp
  | typeof prisma.callScript_temp
  | typeof prisma.emailScript_temp;

async function saveToDatabase<T extends TempDBModel>(
  model: T,
  data: Prisma.Args<T, "create">["data"]
): Promise<Prisma.PromiseReturnType<T["create"]>> {
  try {
    const result = await (model as any).create({ data });
    return result;
  } catch (error) {
    console.error(`Error saving data to ${model.toString()}:`, error);
    throw error;
  }
}

export const parseUsers = (data: any[]): Prisma.Users_tempCreateManyInput[] => {
  return data.map((row) => ({
    email: row.user_email,
    password: row.password || "default_password",
    password_hint: row.password_hint || null,
    created_at: new Date(),
    roleId: row.role_id,
  }));
};

export const parseCampUsers = (
  data: any[],
  campaignName: string
): Prisma.Camp_users_tempCreateManyInput[] => {
  return data.map((row) => ({
    user_email: row.user_email,
    campaign_name: campaignName,
    user_queueID: row.user_queueID,
    created_at: new Date(),
  }));
};

export const parseTopics = (data: any[], campaignName: string = ""): any[] => {
  return data.map((row) => ({
    title: row.title,
    category: row.category,
    detail: row.detail,
    topic_identifier: `${campaignName}_${row.title}`,
  }));
};

export const parseCampaign = (data: CampaignRow): ParsedCampaign => {
  return {
    name: data.name,
    company_name: data.company_name,
    company_site: data.company_site,
    product_id: parseInt(data.product_id, 10),
    product_name: data.product_name,
    product_category: data.product_category,
    vertical_1: data.vertical_1,
    vertical_2: data.vertical_2,
    vertical_3: data.vertical_3,
    active: true,
    created_at: new Date(),
  };
};

const parseCampaignData = (
  data: [number, string, string | undefined][]
): CampaignSetupData => {
  const campaignDetails: CampaignDetails = {} as CampaignDetails;
  const functions: MarketFocus["Functions"] = [];
  const industries: MarketFocus["Industries"] = [];

  data.forEach(([_, key, value]) => {
    if (!value) return;

    if (key.includes("campaign_name")) campaignDetails["Campaign Name"] = value;
    else if (key.includes("company")) campaignDetails["Company Name"] = value;
    else if (key.includes("website"))
      campaignDetails["Company Website"] = value;
    else if (key.includes("product_id"))
      campaignDetails["Product id"] = parseInt(value);
    else if (key.includes("product_name"))
      campaignDetails["Product Name"] = value;
    else if (key.includes("product_category"))
      campaignDetails["Product Category"] = value;
    else if (key.includes("sub_category1"))
      campaignDetails["Product Subcategory 1"] = value;
    else if (key.includes("sub_category2"))
      campaignDetails["Product Subcategory 2"] = value;
    else if (key.includes("sub_category3"))
      campaignDetails["Product Subcategory 3"] = value;
    else if (key.startsWith("industry_")) industries.push(value);
    else if (key.startsWith("function_")) functions.push(value);
  });

  return {
    CampaignDetails: campaignDetails,
    MarketFocus: { Industries: industries, Functions: functions },
  };
};

export const campaignSetupService = async (file?: Express.Multer.File) => {
  console.log("[REQ in SERVICE]:", file?.originalname);

  if (!file) {
    return {
      message: "File is required",
      data: null,
      statusCode: 500,
    };
  }

  try {
    const usersTempData = await prisma.users_temp.findMany();
    if (usersTempData.length > 0) {
      console.log("Truncating table: users_temp");
      await prisma.users_temp.deleteMany();
    }

    const campUserTempData = await prisma.camp_users_temp.findMany();
    if (campUserTempData.length > 0) {
      console.log("Truncating table: camp_users_temp");
      await prisma.camp_users_temp.deleteMany();
    }

    const topicTempData = await prisma.topics_temp.findMany();
    if (topicTempData.length > 0) {
      console.log("Truncating table: topics_temp");
      await prisma.topics_temp.deleteMany();
    }

    const campaignData = await prisma.campaigns_temp.findMany();
    if (campaignData.length > 0) {
      console.log("Truncating table: campaigns_temp");
      await prisma.campaigns_temp.deleteMany();
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets["settings"];
    const data: [number, string, string | undefined][] =
      XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const parsedData = parseCampaignData(data);

    const prismaCampaignData: Prisma.Campaigns_tempCreateInput = {
      name: parsedData.CampaignDetails["Campaign Name"],
      company_name: parsedData.CampaignDetails["Company Name"],
      company_site: parsedData.CampaignDetails["Company Website"],
      product_id: parsedData.CampaignDetails["Product id"],
      product_name: parsedData.CampaignDetails["Product Name"],
      product_category: parsedData.CampaignDetails["Product Category"],
      vertical_1: parsedData.MarketFocus.Industries[0] || null,
      vertical_2: parsedData.MarketFocus.Industries[1] || null,
      vertical_3: parsedData.MarketFocus.Industries[2] || null,
      active: true,
      created_at: new Date(),
    };

    const campaign = await prisma.campaigns_temp.create({
      data: prismaCampaignData,
    });
    console.log("[DONE INSERTING TO CAMPAIGNS TEMP TABLE]");

    const usersSheet = XLSX.utils.sheet_to_json(workbook.Sheets["camp_users"]);
    const usersData = parseUsers(usersSheet);
    const users_temp = await prisma.users_temp.createMany({ data: usersData });
    const insertedUsers = await prisma.users_temp.findMany();
    console.log("[DONE INSERTING TO USERS TEMP TABLE]");

    const campUsersData = parseCampUsers(usersSheet, campaign.name);
    const campaign_user_temp = await prisma.camp_users_temp.createMany({
      data: campUsersData,
    });
    const insertedCampaignUserTemp = await prisma.camp_users_temp.findMany();
    console.log("[DONE INSERTING TO CAMP_USERS TEMP TABLE]");

    const buySideSheet = XLSX.utils.sheet_to_json(
      workbook.Sheets["buyside-questions"]
    );
    const sellSideSheet = XLSX.utils.sheet_to_json(
      workbook.Sheets["sellside-questions"]
    );
    const topicsData = [
      ...parseTopics(buySideSheet, campaign.name),
      ...parseTopics(sellSideSheet, campaign.name),
    ];
    const topics_temp = await prisma.topics_temp.createMany({
      data: topicsData,
    });
    const insertedTopicsTemp = await prisma.topics_temp.findMany();

    console.log("[DONE INSERTING TO USERS TOPICS TABLE]");

    const resultantQueries = {
      campaigns_temp: campaign,
      users_temp: insertedUsers,
      campaign_user_temp: insertedCampaignUserTemp,
      topics_temp: insertedTopicsTemp,
    };

    return {
      statusCode: 200,
      message: "Successfully generated a result.",
      data: parsedData,
      resultantQueries,
    };
  } catch (error) {
    console.log("[ERROR OCCURED IN THE COMPLETION]:", error);
    return {
      statusCode: 500,
      message: "Some internal server error has occurred.",
      data: null,
    };
  }
};

interface ParsedExcelData {
  settingsSheet: any[];
  buySideSheet: any[];
  sellSideSheet: any[];
  prospectsSheet: any[];
  caseStudiesSheet: any[];
  personasSheet: any[];
}

interface QueryParams {
  messages: { role: string; content: string }[];
  campaignName: string;
}

interface SellSideQuestion {
  id: number;
  category: QuestionCategory;
  detail: string;
}

interface SellSideResults {
  self_intro: { question: string; answer: string }[];
  value_prop: { question: string; answer: string }[];
  case_study: { question: string; answer: string }[];
}

interface ParsedQuestions {
  self_introduction: SellSideQuestion[];
  valueprop_industry: SellSideQuestion[];
  valueprop_persona: SellSideQuestion[];
  casestudy_industry: SellSideQuestion[];
  casestudy_function: SellSideQuestion[];
}

type QuestionCategory =
  | "self_introduction"
  | "valueprop_industry"
  | "valueprop_persona"
  | "casestudy_industry"
  | "casestudy_function";

const parseExcelFile = async (
  file: Express.Multer.File
): Promise<ParsedExcelData> => {
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const settingsSheet = XLSX.utils.sheet_to_json(workbook.Sheets["settings"]);
  const buySideSheet = XLSX.utils.sheet_to_json(
    workbook.Sheets["buyside-questions"]
  );
  const sellSideSheet = XLSX.utils.sheet_to_json(
    workbook.Sheets["sellside-questions"]
  );
  const prospectsSheet = XLSX.utils.sheet_to_json(
    workbook.Sheets["buyside-list"]
  );
  const caseStudiesSheet = XLSX.utils.sheet_to_json(
    workbook.Sheets["case-studies"]
  );
  const personasSheet = XLSX.utils.sheet_to_json(workbook.Sheets["personas"]);

  return {
    settingsSheet,
    buySideSheet,
    sellSideSheet,
    prospectsSheet,
    caseStudiesSheet,
    personasSheet,
  };
};

//The replacePlaceholders function is designed to replace placeholders in a template string
// with corresponding values from a replacements object. Here's a step-by-step explanation:
// 1. The function takes a template string and a replacements object as arguments.
// 2. It uses the replace method on the template string to find all occurrences of placeholders
// in the format {key} and replace them with the corresponding value from the replacements object.

const replacePlaceholders = (
  template: string,
  replacements: Record<string, string>
): string => {
  return template.replace(
    /{(\w+)}/g,
    (_, key) => replacements[key] || `{${key}}`
  );
};

const conductPerplexityQuery = async ({
  messages,
  campaignName,
}: QueryParams): Promise<any> => {
  //    if (global.Offline_mode) {
  //        return { content: "this is a dummy response", links: [] };
  //    }

  const url = "https://api.perplexity.ai/chat/completions";
  const payload = {
    model: "llama-3.1-sonar-small-128k-online",
    messages: [
      {
        role: "system",
        content:
          "You are an artificial intelligence research assistant to sales executives. Your role is to search information from websites and summarize all answers in one sentence of less than 100 words",
      },
      ...messages,
    ],
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Adding new content to check response validity
    let content = response.data.choices[0].message.content;

    const ai_response_acceptable = (content: string): boolean => {
      const keywords = [
        "no ",
        "found",
        "not ",
        "not found",
        "nothing",
        "shares",
        "stock",
        "public offering",
        "IPO",
        "shares sold",
      ];
      return keywords.some((keyword) =>
        content.toLowerCase().includes(keyword)
      );
    };

    if (!ai_response_acceptable(content)) {
      console.log("Debug - Content being rejected:", content);
      content = "";
    }

    if (content == "") {
      console.log(
        "Content rejected:",
        response.data.choices[0].message.content
      );
    }

    // Now verify response validity based on date or recency
    const verifyContentWithPerplexity = async (
      content: string
    ): Promise<boolean> => {
      const url = "https://api.perplexity.ai/chat/completions";

      //create an if statement to check which buy-side question we are answering and based on that include validity dates in the verification ???
      const query1 =
        "Conduct a web search to answer in one word without giving any details, if this statement is likely true or false:";

      const payload = {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that verifies the factual accuracy of statements by conducting web searches. Respond with 'true' if the statement is factually accurate and 'false' if it is not.",
          },
          {
            role: "user",
            content: `${query1} ${content}`,
          },
        ],
        temperature: 0.7,
      };

      try {
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        const result = response.data.choices[0].message.content
          .trim()
          .toLowerCase();
        return result == "true";
      } catch (error) {
        console.error("Error verifying content with Perplexity:", error);
        throw new Error("Error verifying content with Perplexity");
      }
    };

    // Check if the content is verifiable - only check if the content is not empty
    const isContentVerified = content
      ? await verifyContentWithPerplexity(content)
      : false;

    if (!isContentVerified) {
      console.log("AI Search results not verifiable:", content);
      content = "";
    }

    const links = extractLinks(content);
    // returns an object that includes query response and citation links. If no links are found, an empty array is returned.
    // old code: return { content: response.data, links: links || [] };
    // now created code that returns the variable content even if has been assigned to an empty string
    return { content: content, links: links || [] };
  } catch (error) {
    console.error("Error querying Perplexity:", error);
    throw new Error("Error querying Perplexity");
  }
};

const aggregateReferences = (
  buySideResults: { question: string; answer: string; links: string[] }[]
): string[] => {
  // console.log("links:",links);
  const references: string[] = [];
  buySideResults.forEach(({ links }) => {
    references.push(...links);
  });
  return [...new Set(references)]; // Remove duplicate links
};

const categorizeQuestions = (sellSideSheet: any[]): ParsedQuestions => {
  const categorizedQuestions: ParsedQuestions = {
    self_introduction: [],
    valueprop_industry: [],
    valueprop_persona: [],
    casestudy_industry: [],
    casestudy_function: [],
  };

  sellSideSheet.forEach((question: any) => {
    console.log("[Question]:", question);
    const category = question.category as QuestionCategory;
    if (categorizedQuestions[category]) {
      categorizedQuestions[category].push({
        id: question.id,
        category,
        detail: question.detail,
      });
    }
  });

  return categorizedQuestions;
};

// this function is designed to extract links from a given text string.
// Here's a step-by-step explanation:
// 1. The function uses a regular expression to match URLs in the text string.
// 2. It uses the match method to find all occurrences of URLs in the text string.
// 3. It returns the array of URLs found in the text string.

const extractAndFilterSettings = (
  settingsSheet: any[]
): { industries: string[]; functions: string[] } => {
  const industries = Object.keys(settingsSheet[0])
    .filter((key) => key.startsWith("industry_"))
    .map((key) => settingsSheet[0][key])
    .filter((industry) => industry && industry.trim() !== "");

  const functions = Object.keys(settingsSheet[0])
    .filter((key) => key.startsWith("function_"))
    .map((key) => settingsSheet[0][key])
    .filter((func) => func && func.trim() !== "");

  return {
    industries: [...new Set(industries)],
    functions: [...new Set(functions)],
  };
};

// The generateCaseStudyMappings function is designed to generate mappings between case studies, industries, and functions.
// Here's a step-by-step explanation:
// 1. The function takes a list of case studies, industries, functions, and a query function as arguments.
// 2. It generates a query string based on the input case studies, industries, and functions.
// 3. It calls the query function with the generated query string to get the mappings.
// 4. It parses the response from the query function and returns the case study mappings.

const generateCaseStudyMappings = async (
  caseStudies: { id: string; value: string }[],
  industries: string[],
  functions: string[],
  queryFunction: (query: string) => Promise<string>
): Promise<
  {
    caseStudy: string;
    relevantIndustries: string[];
    relevantFunctions: string[];
  }[]
> => {
  console.log(
    "[INDUSTRIES IN PARAMS OF generateCaseStudyMappings]:",
    industries
  );
  console.log("[FUNCTIONS IN PARAMS OF generateCaseStudyMappings]:", functions);

  const caseStudyDescriptions = caseStudies
    .map((cs) => `"${cs.value}"`)
    .join("\n");
  const industryList = industries.map((industry) => `- ${industry}`).join("\n");
  const functionList = functions.map((func) => `- ${func}`).join("\n");

  const query = `
        reply with JSON, nothing else

        You are an expert in analyzing business use cases. Below is a list of case studies followed by industries and functions. 
        Assign the most relevant industries and functions to each case study in JSON format.

        Case Studies:
        ${caseStudyDescriptions}

        Industries:
        ${industryList}

        Functions:
        ${functionList}

        Expected JSON Output:
        [
            {
                "caseStudy": "First case study description...",
                "relevantIndustries": ["Industry1", "Industry2"],
                "relevantFunctions": ["Function1", "Function2"]
            },
            ...
        ]
    `;

  try {
    console.log("[QUERY IN GENERATE CASE STUDY MAPPING]:", query);
    const response = await queryFunction(query);
    return JSON.parse(response).map((result: any) => ({
      caseStudy: result.caseStudy,
      relevantIndustries: result.relevantIndustries || [],
      relevantFunctions: result.relevantFunctions || [],
    }));
  } catch (error) {
    console.error("Error generating case study mappings:", error);
    throw new Error("Failed to generate case study mappings.");
  }
};

const storeMappings = async (
  industries: any[],
  functions: any[],
  caseStudiesSheet: any[],
  settingsSheet: any[],
  queryFunction: (query: string) => Promise<string>
): Promise<
  {
    caseStudy: string;
    relevantIndustries: string[];
    relevantFunctions: string[];
  }[]
> => {
  console.log("[Extracted Industries]:", industries);
  console.log("[Extracted Functions]:", functions);

  const caseStudies = caseStudiesSheet.map((row: any) => ({
    id: row["study-no"],
    value: row.value,
  }));

  const mappings = await generateCaseStudyMappings(
    caseStudies,
    industries,
    functions,
    queryFunction
  );

  return mappings.map((mapping) => ({
    caseStudy: mapping.caseStudy,
    relevantIndustries: mapping.relevantIndustries || [],
    relevantFunctions: mapping.relevantFunctions || [],
  }));
};

const processQuestionsByCategory = async (
  questions: ParsedQuestions,
  replacements: Record<string, string>,
  queryFunction: (question: string) => Promise<string>,
  personasSheet: any[],
  caseStudies: {
    caseStudy: string;
    relevantIndustries: string[];
    relevantFunctions: string[];
  }[],
  industries: any[],
  functions: any[]
): Promise<SellSideResults> => {
  const results: SellSideResults = {
    self_intro: [],
    value_prop: [],
    case_study: [],
  };

  const batchSize = 5;

  results.self_intro = await processBatch(
    questions.self_introduction,
    batchSize,
    async (question) => {
      const query = replacePlaceholders(question.detail, replacements);
      const answer = await queryFunction(query);
      return { question: question.detail, answer };
    }
  );

  // Value Proposition by Industry
  results.value_prop = await processBatch(
    questions.valueprop_industry,
    batchSize,
    async (question) => {
      const industryResults = [];
      for (const industry of replacements["industries"].split(",")) {
        const relevantCaseStudy = caseStudies.find((cs) =>
          cs.relevantIndustries.includes(industry.toLowerCase())
        );

        const caseStudyContext = relevantCaseStudy
          ? ` This is based on the case study: "${relevantCaseStudy.caseStudy}"`
          : " No specific case study available for this industry.";

        const query = `${replacePlaceholders(question.detail, {
          ...replacements,
          industry_type: industry,
        })}.\n\n${caseStudyContext}`;

        const answer = await queryFunction(query);
        industryResults.push({
          question: `${question.detail} for ${industry}`,
          answer,
        });
      }
      return industryResults;
    }
  );

  // Value Proposition by Persona
  results.value_prop.push(
    ...(await processBatch(
      questions.valueprop_persona,
      batchSize,
      async (question) => {
        const personaResults = [];
        for (const personaObj of personasSheet) {
          const persona = Object.values(personaObj)[0];
          if (!persona) continue;

          const personaContext = `For ${persona}: `;
          const query =
            personaContext + replacePlaceholders(question.detail, replacements);
          const answer = await queryFunction(query);
          personaResults.push({
            question: `${question.detail} for ${personaObj.name}`,
            answer,
          });
        }
        return personaResults;
      }
    ))
  );

  // Case Study by Industry
  results.case_study.push(
    ...(await processBatch(
      questions.casestudy_industry,
      batchSize,
      async (question) => {
        const industryResults = [];
        for (const industry of replacements["industries"].split(",")) {
          const relevantCaseStudy = caseStudies.find((cs) =>
            cs.relevantIndustries.includes(industry.trim())
          );

          const caseStudyContext = relevantCaseStudy
            ? ` This case study is relevant to the ${industry} industry: "${relevantCaseStudy.caseStudy}"`
            : ` No specific case study available for the ${industry} industry.`;

          const query = `${replacePlaceholders(question.detail, {
            ...replacements,
            industry_type: industry,
          })}.\n\n${caseStudyContext}`;

          const answer = await queryFunction(query);
          industryResults.push({
            question: `${question.detail} for ${industry}`,
            answer,
          });
        }
        return industryResults;
      }
    ))
  );

  // Case Study by Function
  results.case_study.push(
    ...(await processBatch(
      questions.casestudy_function,
      batchSize,
      async (question) => {
        const functionResults = [];
        for (const func of functions) {
          const relevantCaseStudy = caseStudies.find((cs) =>
            cs.relevantFunctions.includes(func.trim())
          );

          const caseStudyContext = relevantCaseStudy
            ? ` This case study is relevant to the ${func} function: "${relevantCaseStudy.caseStudy}"`
            : ` No specific case study available for the ${func} function.`;

          const query = `${replacePlaceholders(
            question.detail,
            replacements
          )}.\n\n${caseStudyContext}`;
          const answer = await queryFunction(query);
          functionResults.push({
            question: `${question.detail} for ${func}`,
            answer,
          });
        }
        return functionResults;
      }
    ))
  );

  return results;

  // console.log("[Case studies array]:", caseStudies);

  // for (const question of questions.self_introduction) {
  //     const query = replacePlaceholders(question.detail, replacements);
  //     // results.self_intro.push(await queryFunction(query));
  //     const answer = await queryFunction(query);
  //     results.self_intro.push({ question: question.detail, answer });
  // }

  // for (const question of questions.valueprop_industry) {
  //     // const industries = replacements.industries.split(",");

  //     for (const industry of replacements["industries"].split(",")) {
  //         const relevantCaseStudy = caseStudies.find(cs =>
  //             cs.relevantIndustries.includes(industry.toLocaleLowerCase())
  //         );

  //         console.log("[RELEVANT CASE STUDIES]:", relevantCaseStudy);

  //         const caseStudyContext = relevantCaseStudy
  //             ? ` This is based on the case study: "${relevantCaseStudy.caseStudy}"`
  //             : " No specific case study available for this industry.";

  //         const query = `${replacePlaceholders(question.detail, {
  //             ...replacements,
  //             case_study: caseStudy,
  //         })}.\n\n${caseStudyContext}`;

  //         // const query = `For the industry "${industry}": ${replacePlaceholders(question.detail, {
  //         //     ...replacements,
  //         //     case_study: caseStudy,
  //         // })}`;
  //         // results.value_prop.push(await queryFunction(query));
  //         const answer = await queryFunction(query);
  //         results.value_prop.push({ question: `${question.detail} for ${industry}`, answer });
  //     }
  // }

  // for (const question of questions.valueprop_persona) {
  //     const personaResults: string[] = [];
  //     for (const personaObj of personasSheet) {
  //         console.log("{CONSOLE THE PERONSA}:", personaObj);

  //         const persona = Object.values(personaObj)[0];
  //         console.log("{CONSOLE THE PERSONA}:", persona);

  //         if (!persona) {
  //             console.warn("Skipping undefined or null persona");
  //             continue;
  //         }

  //         const personaContext = `For ${persona}: `;
  //         const query = personaContext + replacePlaceholders(question.detail, {
  //             ...replacements,

  //         });
  //         try {
  //             const result = await queryFunction(query);
  //             results.value_prop.push({ question: `${question.detail} for ${personaObj.name}`, answer: result });
  //         } catch (error) {
  //             console.error("Error processing query for persona:", persona, error);
  //         }

  //     }
  //     // results.value_prop.push(...personaResults);

  // }

  // for (const question of questions.casestudy_industry) {
  //     const industries = replacements.industries.split(",");

  //     for (const industry of replacements["industries"].split(",")) {
  //         const relevantCaseStudy = caseStudies.find(cs =>
  //             cs.relevantIndustries.includes(industry.trim())
  //         );

  //         const caseStudyContext = relevantCaseStudy
  //             ? ` This case study is relevant to the ${industry} industry: "${relevantCaseStudy.caseStudy}"`
  //             : ` No specific case study available for the ${industry} industry.`;

  //         // const query = `${question.detail}${caseStudyContext}`;

  //         const query = `${replacePlaceholders(question.detail, {
  //             ...replacements,
  //             industry_type: industry
  //         })}.\n\n${caseStudyContext}`;
  //         const answer = await queryFunction(query);
  //         results.case_study.push({ question: `${question.detail} for ${industry}`, answer });
  //     }
  // }

  // for (const question of questions.casestudy_function) {
  //     // const functions = replacements.functions.split(",");

  //     for (const func of functions) {
  //         const relevantCaseStudy = caseStudies.find(cs =>
  //             cs.relevantFunctions.includes(func.trim())
  //         );

  //         const caseStudyContext = relevantCaseStudy
  //             ? ` This case study is relevant to the ${func} function: "${relevantCaseStudy.caseStudy}"`
  //             : ` No specific case study available for the ${func} function.`;

  //         // const query = `${question.detail}${caseStudyContext}`;
  //         const query = `${replacePlaceholders(question.detail, {
  //             ...replacements,
  //             // industry_type: industry
  //         })}.\n\n${caseStudyContext}`;
  //         const answer = await queryFunction(query);
  //         results.case_study.push({ question: `${question.detail} for ${func}`, answer });
  //     }
  // }

  // return results;
};

const getCaseStudyForIndustry = (
  industry: string,
  caseStudiesSheet: any[]
): string | null => {
  const matchingCaseStudy = caseStudiesSheet.find((caseStudy: any) => {
    caseStudy.value.toLowerCase() === industry.toLowerCase();
    console.log("{CASE STUDY}:", caseStudy);
  });
  return matchingCaseStudy ? matchingCaseStudy.value : null;
};

// const conductAWSBedrockQueryWithRetry = async (
//     question: string,
//     retries = 5
// ): Promise<string> => {
//     let attempt = 0;
//     let delayMs = 500;

//     const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//     while (attempt < retries) {
//         try {
//             return await conductAWSBedrockQuery(question);
//         } catch (error: any) {
//             if (error.message.includes("Too many requests")) {
//                 console.warn(`Retrying... Attempt ${attempt + 1} after ${delayMs}ms`);
//                 await delay(delayMs);
//                 delayMs *= 2; // Exponential backoff
//                 attempt++;
//             } else {
//                 throw error;
//             }
//         }

//     throw new Error("Max retries exceeded for AWS Bedrock query");
// };

const createBatches = <T>(array: T[], batchSize: number): T[][] => {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
};

const conductAWSBedrockQuery = async (questions: string): Promise<string> => {
  // const params = {
  //     modelIdentifier: BEDROCK_MODEL_ARN,
  //     inputText: question,
  // };

  const client = new BedrockRuntimeClient(getAWSBedrockConfig());

  return "mock output from bedrock query";

  try {
    console.log("[BEDROCK] Invoking model with batched question:", questions);

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: JSON.stringify([{ type: "text", text: questions }]),
        },
      ],
    };

    // Use retry mechanism for AWS operations
    return await retryWithExponentialBackoff(async () => {
      const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      });

      const apiResponse = await client.send(command);

      const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
      const responseBody = JSON.parse(decodedResponseBody);
      return responseBody.content[0].text;
    });
  } catch (error) {
    console.error("Error querying AWS Bedrock:", error);
    throw new Error("Error querying AWS Bedrock");
  }
};

const generateContextFromBuySideResults = async (
  buySideResults: { question: string; answer: string }[]
): Promise<string> => {
  let aggregatedContext = "";

  buySideResults.forEach(({ question, answer }) => {
    if (
      answer.toLowerCase().includes("not found") ||
      answer.toLowerCase().includes("nothing found") ||
      answer.toLowerCase().includes("no data")
    ) {
      return;
    }

    aggregatedContext += `For "${question}": ${answer}\n`;
  });

  return aggregatedContext.trim();
};

const mapCaseStudyValues = (prospectSheet: any, caseStudiesSheet: any) => {
  const result = prospectSheet?.map((prospect: any) => {
    const { case_study_id } = prospect;
    if (!case_study_id) {
      return { ...prospect, case_study_value: null };
    }

    const matchingCaseStudy = caseStudiesSheet?.find(
      (caseStudy: any) => caseStudy["study-no"] === case_study_id
    );

    return {
      ...prospect,
      case_study_value: matchingCaseStudy ? matchingCaseStudy.value : null,
    };
  });

  return result;
};

const generateEmailContent = async (
  data: ParsedExcelData,
  seller_company: string,
  context: string,
  case_study: string,
  references: any
): Promise<string> => {
  const { prospectsSheet, settingsSheet } = data;
  const { f_name, l_name, company, caseStudy, title, industry } =
    prospectsSheet[0];
  const sellerCompany = settingsSheet[0]?.company;
  const productCategory = settingsSheet[0]?.product_category || "N/A";

  const query = `
       Generate an email of 200 words or less, from the Sender to a customer. The Sender is the Head of Partnerships at ${seller_company} and the customer is ${f_name} ${l_name}, the ${title} of ${company}. \
                The email format should strictly follow the following steps and it should only use the data provided in this query. \
                Step1: create a personalized greeting using only the following text: ${context}. \
                Step2: create a customer success story that ${seller_company} has enabled in the ${industry} industry using the following data: ${case_study}. \
                Step3: say that your company ${seller_company} has conducted an in-depth strategic analysis on Customer's Company, and will be happy to share more details over a call. \
                Step4: conclude by inviting the customer to a call next Tuesday or Friday.. 
                Step5: after ending the body of email, add these references: ${references}
    `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: query }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Error generating email");
  }
};

const generateFirstEmailContent = async (
  data: ParsedExcelData,
  seller_company: string,
  context: string,
  case_study: string,
  references: any
): Promise<string> => {
  const { prospectsSheet, settingsSheet } = data;
  const { f_name, l_name, company, caseStudy, title, industry } =
    prospectsSheet[0];
  const sellerCompany = settingsSheet[0]?.company;
  const productCategory = settingsSheet[0]?.product_category || "N/A";

  const query = `
       Generate an email of 200 words or less, from the Sender to a customer. The Sender is the Head of Partnerships at ${seller_company} and the customer is ${f_name} ${l_name}, the ${title} of ${company}. \
                The email format should strictly follow the following steps and it should only use the data provided in this query. \
                Step1: create a personalized greeting using only the following text: ${context}. \
                Step2: create a customer success story that ${seller_company} has enabled in the ${industry} industry using the following data: ${case_study}. \
                Step3: say that your company ${seller_company} has conducted an in-depth strategic analysis on Customer's Company, and will be happy to share more details over a call. \
                Step4: conclude by inviting the customer to a call next Tuesday or Friday.. 
                Step5: after ending the body of email, add these references: ${references}
    `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: query }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Error generating email");
  }
};

const extractLinks = (text: string): string[] => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.match(regex) || [];
};

/**
 * The `aiSearchService` function processes an Excel file, truncates temporary tables, parses the data,
 * and performs various operations to generate campaign-related data, including buyer-side research,
 * email content, and database insertions.
 *
 * The `finalBuySideResults` array is created by mapping over `buySideResults` and only moving 3 fields:
 * `question`, `answer`, and `links` from `buySideResults` to `finalBuySideResults`.
 */

export const aiSearchService = async (
  file?: Express.Multer.File
): Promise<any> => {
  try {
    if (!file) {
      return;
    }

    // Truncate temporary callScript_temp, emailScript_temp and buyersList_temp tables in case they have any existing data
    const callScriptData = await prisma.callScript_temp.findMany();
    if (callScriptData.length > 0) {
      console.log("Truncating table: callScript_temp");
      await prisma.callScript_temp.deleteMany();
    }

    const emailScriptData = await prisma.emailScript_temp.findMany();
    if (emailScriptData.length > 0) {
      console.log("Truncating table: emailScript_temp");
      await prisma.emailScript_temp.deleteMany();
    }

    const buyerListData = await prisma.buyerList_temp.findMany();
    if (buyerListData.length > 0) {
      console.log("Truncating table: buyerList_temp");
      await prisma.buyerList_temp.deleteMany();
    }

    console.log("Tables truncated successfully.");

    const {
      settingsSheet,
      buySideSheet,
      sellSideSheet,
      prospectsSheet,
      caseStudiesSheet,
      personasSheet,
    } = await parseExcelFile(file);
    console.log("[EXCEL FILE PARSED DATA]:");

    const campaignData = parseCampaignData(
      settingsSheet.map((row: any) => [0, row.setting || "", row.value])
    );

    const buySideQuestions = parseTopics(
      buySideSheet,
      campaignData.CampaignDetails["Campaign Name"]
    );

    const sellSideQuestions = parseTopics(
      sellSideSheet,
      campaignData.CampaignDetails["Campaign Name"]
    );

    const mappedProspects = prospectsSheet.map((prospect: any) => ({
      ...prospect,
      campaign_name: campaignData.CampaignDetails["Campaign Name"],
      buyer_identifier:
        campaignData.CampaignDetails["Campaign Name"] +
        prospect.id +
        prospect.f_name +
        prospect.l_name,
      case_study_value:
        caseStudiesSheet.find(
          (case_study) => case_study["study-no"] === prospect.casestudy_no
        )?.value || null,
    }));

    // this can be set to openAI as well

    const aiService = AiService(
      openAIQueryService as OpenAIQueryService,
      perplexityQueryService as PerplexityQueryService,
      bedrockQueryService as BedrockQueryService,
      AI_STRATEGY,
      isDev()
    );

    const buySideAnswers: {
      buyer_id: string;
      product_id: number;
      topic_id: string;
      description: string;
    }[] = [];
    const buySideEmailAnswers: {
      buyer_id: string;
      email1: string;
      email2: string;
      email3: string;
      linkedIn1: string;
      linkedIn2: string;
    }[] = [];
    const sellSideAnswers = [];

    const processedProspects = await Promise.all(
      mappedProspects.map(async (prospect) => {
        const {
          f_name,
          l_name,
          company,
          linkedin,
          title,
          industry,
          function: func,
          website,
        } = prospect;

        let caseStudy = "",
          valueProp = "";
        try {
          ({ caseStudy, valueProp } = await aiService.conductBedrockQueryRag(
            campaignData.CampaignDetails["Company Name"],
            industry,
            func,
            title
          ));
        } catch (err) {
          console.error(
            "Error in conductBedrockQueryRag for:",
            f_name + l_name
          );
          caseStudy = "";
          valueProp = "";
        }

        let titleVerified = false;
        try {
          titleVerified = await aiService.verifyBuyerTitle(
            f_name,
            l_name,
            company,
            linkedin,
            title
          );
        } catch (err) {
          console.error("Error in verifyBuyerTitle for:", err);
        }

        let personalFacts = "",
          jobChallenges = "",
          companyNews = "",
          companyPriorities = "",
          companyPriorities1 = "",
          companyPriorities2 = "",
          companyValues = "",
          personalFactsCitations = "",
          jobChallengesCitations = "",
          companyNewsCitations = "",
          companyPrioritiesCitations = "",
          companyValuesCitations = "";

        await Promise.all(
          buySideQuestions.map(async (question, idx) => {
            try {
              const query_idx = idx + 1;
              const query = question.detail
                .replace(
                  "{product_category}",
                  campaignData.CampaignDetails["Product Category"]
                )
                .replace("{buyer_function}", func)
                .replace("{buyer_industry}", industry)
                .replace("{buyer_website}", website)
                .replace("{buyer_company}", company)
                .replace(
                  "{company_name}",
                  campaignData.CampaignDetails["Company Name"]
                )
                .replace("{f_name}", f_name)
                .replace("{l_name}", l_name)
                .replace("{buyer_title}", title);

              let response = "",
                citations = "";
              try {
                ({ response, citations } = await aiService.conductWebQuery(
                  query
                ));
              } catch (err) {
                console.error(`Error in conductWebQuery for query: ${query}`);
              }

              let isResponseUsable = false;
              try {
                isResponseUsable = await aiService.acceptOrRejectResponse(
                  response
                );
              } catch (err) {
                console.error("Error in acceptOrRejectResponse for", query);
              }

              if (!isResponseUsable) response = "";

              // Verify factual correctness
              let responseVerified = false;

              let validityDate;
              if (query_idx < 4) {
                validityDate = "Irrelevant";
              } else if (query_idx === 4) {
                validityDate = "July 1, 2024";
              } else {
                validityDate = "January 1, 2024";
              }

              try {
                if (isResponseUsable) {
                  responseVerified = await aiService.verifyWebQuery(
                    response,
                    validityDate,
                    0
                  );
                }
              } catch (err) {
                console.error("Error in verifyWebQuery:", err);
              }

              if (responseVerified) {
                switch (query_idx) {
                  case 1:
                  case 2:
                  case 3:
                    personalFacts += response;
                    personalFactsCitations += citations;
                    break;
                  case 4:
                    jobChallenges += response;
                    jobChallengesCitations += citations;
                    break;
                  case 5:
                  case 6:
                    companyNews += response;
                    companyNewsCitations += citations;
                    break;
                  case 7:
                    companyPriorities1 = response;
                    companyPrioritiesCitations += citations;
                    break;
                  case 8:
                    companyPriorities2 = response;
                    companyPriorities = companyPriorities1 + companyPriorities2;
                    companyPrioritiesCitations += citations;
                    break;
                  case 9:
                    companyValues += response;
                    companyValuesCitations += citations;
                    break;
                }
              }

              if (responseVerified) {
                buySideAnswers.push({
                  buyer_id: prospect.buyer_identifier,
                  product_id:
                    campaignData.CampaignDetails["Product id"] ?? Math.random(),
                  topic_id: question.topic_identifier,
                  description: response,
                });
              } else {
                console.error("Response not verified for:", {
                  buyer_id: prospect.buyer_identifier,
                  query: query,
                });
              }
            } catch (err) {
              console.error("Error processing buySideQuestion:", err);
            }
            return Promise.resolve(prospect);
          })
        );

        let generatedDrafts = {
          emailDraftPas: "",
          emailDraftAida: "",
          emailDraftFab: "",
          draftLinkedinMessage1: "",
          draftLinkedinMessage2: "",
        };

        try {
          generatedDrafts = await aiService.generateEmailDrafts(
            {
              companyName: campaignData.CampaignDetails["Company Name"],
              ProductCategory: campaignData.CampaignDetails["Product Category"],
            },
            {
              titleVerified,
              f_name,
              l_name,
              title,
              company,
              func,
              industry,
            },
            {
              caseStudy,
              valueProp,
            },
            {
              personalFacts,
              jobChallenges,
              companyNews,
              companyPriorities,
              companyPriorities1,
              companyPriorities2,
              companyValues,
              personalFactsCitations,
              jobChallengesCitations,
              companyNewsCitations,
              companyPrioritiesCitations,
              companyValuesCitations,
            }
          );
        } catch (err) {
          console.error("Error in generateEmailDrafts:", err);
        }

        buySideEmailAnswers.push({
          buyer_id: prospect.buyer_identifier,
          email1: generatedDrafts.emailDraftPas,
          email2: generatedDrafts.emailDraftAida,
          email3: generatedDrafts.emailDraftFab,
          linkedIn1: generatedDrafts.draftLinkedinMessage1,
          linkedIn2: generatedDrafts.draftLinkedinMessage2,
        });

        return Promise.resolve(prospect);
      })
    );

    const buyer = await Promise.all(
      processedProspects.map(async (prospect) => {
        return saveToDatabase(prisma.buyerList_temp, {
          s_no: prospect.id,
          buyer_identifier: prospect.buyer_identifier,
          f_name: prospect.f_name,
          l_name: prospect.l_name,
          company: prospect.company,
          title: prospect.title,
          website: prospect.website,
          linkedin: prospect.linkedin,
          location: prospect.location,
          email: prospect.email,
          phone: prospect.phone,
          industry: prospect.industry,
          function: prospect.function,
          caseStudyId: prospect.casestudy_no || null,
          campaign_name: prospect.campaign_name,
        });
      })
    );

    const callScripts = await Promise.all(
      buySideAnswers.map(async (answer) => {
        return saveToDatabase(prisma.callScript_temp, {
          buyerId: answer.buyer_id,
          productId: answer.product_id,
          topicId: answer.topic_id,
          description: answer.description,
        });
      })
    );

    const emailScript = await Promise.all(
      buySideEmailAnswers.map(async (answer) => {
        return saveToDatabase(prisma.emailScript_temp, {
          buyerId: answer.buyer_id,
          email1: answer.email1,
          email2: answer.email2,
          email3: answer.email3,
          linkedIn1: answer.linkedIn1,
          linkedIn2: answer.linkedIn2,
        });
      })
    );

    return {
      statusCode: HttpStatusCode.Ok,
      message: "AI Research Completed Successfully and Saved to Database",
      data: {
        buySideResults: buySideAnswers,
        emailContent: buySideEmailAnswers,
      },
      dataInsertedToTables: [
        //? why array of objects?
        {
          buyer,
          callScripts,
          emailScript,
        },
      ],
    };
  } catch (error) {
    console.error("Error in AI Search Service:", error);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      message: "Internal Server Error",
      data: null,
    };
  }
};

/**
 * The `commitToDbService` function commits data from temporary tables to the original tables in the database.
 * It reads data from various temp tables such as `users_temp`, `camp_users_temp`, `topics_temp`, `campaigns_temp`,
 * `buyerList_temp`, `callScript_temp`, `sellSideScript_temp`, and `emailScript_temp`, and stores them in local variables
 * like `usersTemp`, `campUsersTemp`, `topicsTemp`, etc.
 *
 * The function performs the following steps:
 * 1. Reads data from all temp tables and stores them in local variables.
 * 2. Checks if there is any data to commit. If no data is found, it returns a message indicating no data to commit.
 * 3. Commits data from temp tables to the original tables in the database.
 * 4. Deletes data from temp tables after committing to the original tables.
 *
 * @returns {Promise<{status: number, message: string}>} - A promise that resolves to an object containing the status and message.
 *
 * @throws {Error} - Throws an error if any internal server error occurs during the process.
 */

export const commitToDbService = async () => {
  try {
    console.log("[COMMIT TO DB] Starting data transfer from temp tables to permanent tables");
    
    // Fetch all data from temp tables
    const usersTemp = await prisma.users_temp.findMany();
    const campUsersTemp = await prisma.camp_users_temp.findMany();
    const topicsTemp = await prisma.topics_temp.findMany();
    const campaignsTemp = await prisma.campaigns_temp.findMany();
    const buyerSideTemp = await prisma.buyerList_temp.findMany();
    const callScriptTemp = await prisma.callScript_temp.findMany();
    const sellerSideTemp = await prisma.sellSideScript_temp.findMany();
    const emailScriptTemp = await prisma.emailScript_temp.findMany();

    console.log(`[COMMIT TO DB] Found data in temp tables:
      - Users: ${usersTemp.length}
      - Camp Users: ${campUsersTemp.length}
      - Topics: ${topicsTemp.length}
      - Campaigns: ${campaignsTemp.length}
      - Buyer List: ${buyerSideTemp.length}
      - Call Scripts: ${callScriptTemp.length}
      - Seller Side Scripts: ${sellerSideTemp.length}
      - Email Scripts: ${emailScriptTemp.length}
    `);

    // Check if there's any data to transfer
    if (
      usersTemp.length === 0 &&
      campUsersTemp.length === 0 &&
      topicsTemp.length === 0 &&
      campaignsTemp.length === 0 &&
      buyerSideTemp.length === 0 &&
      callScriptTemp.length === 0 &&
      sellerSideTemp.length === 0 &&
      emailScriptTemp.length === 0
    ) {
      return {
        message: "No data to commit in temp tables.",
        status: 404,
      };
    }

    // Track successful transfers for reporting
    const transferResults = {
      campaigns: 0,
      users: 0,
      campUsers: 0,
      topics: 0,
      buyers: 0,
      callScripts: 0,
      sellerSideScripts: 0,
      emailScripts: 0,
    };

    try {
      // Use transaction to ensure atomicity
      await prisma.$transaction(
        async (tx) => {
          console.log("[COMMIT TO DB] Starting transaction");
          
          // Transfer campaigns
          for (const campaign of campaignsTemp) {
            try {
              await tx.campaigns.upsert({
                where: { name: campaign.name },
                update: {
                  name: campaign.name,
                  company_name: campaign.company_name,
                  company_site: campaign.company_site,
                  product_id: campaign.product_id,
                  product_name: campaign.product_name,
                  product_category: campaign.product_category,
                  vertical_1: campaign.vertical_1,
                  vertical_2: campaign.vertical_2,
                  vertical_3: campaign.vertical_3,
                  active: campaign.active,
                },
                create: {
                  name: campaign.name,
                  company_name: campaign.company_name,
                  company_site: campaign.company_site,
                  product_id: campaign.product_id,
                  product_name: campaign.product_name,
                  product_category: campaign.product_category,
                  vertical_1: campaign.vertical_1,
                  vertical_2: campaign.vertical_2,
                  vertical_3: campaign.vertical_3,
                  active: campaign.active,
                  created_at: campaign.created_at,
                },
              });
              transferResults.campaigns++;
            } catch (error: any) {
              console.error(`[COMMIT TO DB] Error transferring campaign ${campaign.name}:`, error);
              throw new Error(`Failed to transfer campaign ${campaign.name}: ${error.message || 'Unknown error'}`);
            }
          }

          // Transfer users
          try {
            // Get all existing emails from the database
            const existingEmails = new Set(
              (await tx.users.findMany({ select: { email: true } })).map(
                (user) => user.email
              )
            );

            // Insert new records only if the email doesn't already exist
            const newUsers = usersTemp.filter((user) => !existingEmails.has(user.email));
            
            if (newUsers.length > 0) {
              await tx.users.createMany({
                data: newUsers.map((user) => ({
                  email: user.email,
                  password: user.password,
                  password_hint: user.password_hint,
                  created_at: user.created_at,
                  roleId: user.roleId,
                })),
                skipDuplicates: true, // Prevents errors for duplicate emails
              });
              transferResults.users = newUsers.length;
            }
          } catch (error: any) {
            console.error(`[COMMIT TO DB] Error transferring users:`, error);
            throw new Error(`Failed to transfer users: ${error.message || 'Unknown error'}`);
          }

          // Transfer camp users
          try {
            if (campUsersTemp.length > 0) {
              await tx.camp_users.createMany({
                data: campUsersTemp.map((campUser) => ({
                  user_email: campUser.user_email,
                  campaign_name: campUser.campaign_name,
                  user_queueID: campUser.user_queueID,
                  created_at: campUser.created_at,
                })),
                skipDuplicates: true, // Prevents errors for duplicate users
              });
              transferResults.campUsers = campUsersTemp.length;
            }
          } catch (error: any) {
            console.error(`[COMMIT TO DB] Error transferring camp users:`, error);
            throw new Error(`Failed to transfer camp users: ${error.message || 'Unknown error'}`);
          }

          // Transfer topics
          for (const topic of topicsTemp) {
            try {
              await tx.topics.upsert({
                where: { topic_identifier: topic.topic_identifier },
                update: {
                  title: topic.title,
                  category: topic.category,
                  detail: topic.detail,
                  topic_identifier: topic.topic_identifier,
                },
                create: {
                  title: topic.title,
                  category: topic.category,
                  detail: topic.detail,
                  topic_identifier: topic.topic_identifier,
                },
              });
              transferResults.topics++;
            } catch (error: any) {
              console.error(`[COMMIT TO DB] Error transferring topic ${topic.topic_identifier}:`, error);
              throw new Error(`Failed to transfer topic ${topic.topic_identifier}: ${error.message || 'Unknown error'}`);
            }
          }

          // Transfer buyer list
          for (const buyer of buyerSideTemp) {
            try {
              await tx.buyer_list.upsert({
                where: { buyer_identifier: buyer.buyer_identifier },
                update: {
                  s_no: buyer.s_no,
                  buyer_identifier: buyer.buyer_identifier,
                  f_name: buyer.f_name,
                  l_name: buyer.l_name,
                  company: buyer.company,
                  website: buyer.website ?? "",
                  linkedin: buyer.linkedin,
                  location: buyer.location,
                  email: buyer.email,
                  phone: buyer.phone,
                  industry: buyer.industry,
                  function: buyer.function,
                  campaign_name: buyer.campaign_name,
                  title: buyer.title,
                },
                create: {
                  s_no: buyer.s_no,
                  buyer_identifier: buyer.buyer_identifier,
                  f_name: buyer.f_name,
                  l_name: buyer.l_name,
                  company: buyer.company,
                  website: buyer.website ?? "",
                  linkedin: buyer.linkedin,
                  location: buyer.location,
                  email: buyer.email,
                  phone: buyer.phone,
                  industry: buyer.industry,
                  function: buyer.function,
                  campaign_name: buyer.campaign_name,
                  title: buyer.title,
                },
              });
              transferResults.buyers++;
            } catch (error: any) {
              console.error(`[COMMIT TO DB] Error transferring buyer ${buyer.buyer_identifier}:`, error);
              throw new Error(`Failed to transfer buyer ${buyer.buyer_identifier}: ${error.message || 'Unknown error'}`);
            }
          }

          // Transfer call scripts
          for (const callScript of callScriptTemp) {
            try {
              await tx.call_scripts.upsert({
                where: {
                  topic_buyer_id: {
                    buyer_id: callScript.buyerId,
                    topic_id: callScript.topicId,
                  },
                },
                update: {
                  buyer_id: callScript.buyerId,
                  product_id: callScript.productId,
                  topic_id: callScript.topicId,
                  description: callScript.description,
                },
                create: {
                  buyer_id: callScript.buyerId,
                  product_id: callScript.productId,
                  topic_id: callScript.topicId,
                  description: callScript.description,
                },
              });
              transferResults.callScripts++;
            } catch (error: any) {
              console.error(`[COMMIT TO DB] Error transferring call script for buyer ${callScript.buyerId} and topic ${callScript.topicId}:`, error);
              throw new Error(`Failed to transfer call script for buyer ${callScript.buyerId} and topic ${callScript.topicId}: ${error.message || 'Unknown error'}`);
            }
          }

          // Transfer seller side scripts
          try {
            if (sellerSideTemp.length > 0) {
              // Process in batches to avoid potential issues with large datasets
              const batchSize = 50;
              for (let i = 0; i < sellerSideTemp.length; i += batchSize) {
                const batch = sellerSideTemp.slice(i, i + batchSize);
                await tx.sell_side_scripts.createMany({
                  data: batch.map((sellSideScript) => ({
                    category: sellSideScript.category,
                    topic_id: sellSideScript.topicId,
                    product_id: sellSideScript.productId,
                    industry_1: sellSideScript.industry1,
                    industry_2: sellSideScript.industry2,
                    industry_3: sellSideScript.industry3,
                    industry_4: sellSideScript.industry4,
                    industry_5: sellSideScript.industry5,
                    function_1: sellSideScript.function1,
                    function_2: sellSideScript.function2,
                    function_3: sellSideScript.function3,
                    function_4: sellSideScript.function4,
                    function_5: sellSideScript.function5,
                  })),
                  skipDuplicates: true,
                });
                transferResults.sellerSideScripts += batch.length;
              }
            }
          } catch (error: any) {
            console.error(`[COMMIT TO DB] Error transferring seller side scripts:`, error);
            throw new Error(`Failed to transfer seller side scripts: ${error.message || 'Unknown error'}`);
          }

          // Transfer email scripts
          for (const emailScript of emailScriptTemp) {
            try {
              await tx.emailScript.upsert({
                where: { buyer_identifier: emailScript.buyerId },
                update: {
                  email1: emailScript.email1,
                  email2: emailScript.email2,
                  email3: emailScript.email3,
                  linkedIn1: emailScript.linkedIn1,
                  linkedIn2: emailScript.linkedIn2,
                },
                create: {
                  buyer_identifier: emailScript.buyerId,
                  email1: emailScript.email1,
                  email2: emailScript.email2,
                  email3: emailScript.email3,
                  linkedIn1: emailScript.linkedIn1,
                  linkedIn2: emailScript.linkedIn2,
                },
              });
              transferResults.emailScripts++;
            } catch (error: any) {
              console.error(`[COMMIT TO DB] Error transferring email script for buyer ${emailScript.buyerId}:`, error);
              throw new Error(`Failed to transfer email script for buyer ${emailScript.buyerId}: ${error.message || 'Unknown error'}`);
            }
          }

          console.log("[COMMIT TO DB] Transaction completed successfully");
        },
        {
          maxWait: 10000, // Increased from 5000
          timeout: 30000, // Increased from 10000
        }
      );

      console.log("[COMMIT TO DB] Successfully inserted data to main tables:", transferResults);
      
      // Clean up temp tables after successful transfer
      await prisma.$transaction([
        prisma.users_temp.deleteMany(),
        prisma.camp_users_temp.deleteMany(),
        prisma.topics_temp.deleteMany(),
        prisma.campaigns_temp.deleteMany(),
        prisma.callScript_temp.deleteMany(),
        prisma.emailScript_temp.deleteMany(),
        prisma.buyerList_temp.deleteMany(),
        prisma.sellSideScript_temp.deleteMany(),
      ]);
      
      console.log("[COMMIT TO DB] Temp tables cleaned up");

      return {
        message: "Successfully committed data to permanent tables",
        status: 200,
        transferResults,
      };
    } catch (error: any) {
      console.error("[COMMIT TO DB] Transaction failed:", error);
      return {
        message: `Failed to commit data to permanent tables: ${error.message || 'Unknown error'}`,
        status: 500,
        error: error.message || 'Unknown error',
      };
    }
  } catch (error: any) {
    console.error("[COMMIT TO DB] Error:", error);
    return {
      message: `An error occurred: ${error.message || 'Unknown error'}`,
      status: 500,
      error: error.message || 'Unknown error',
    };
  }
};

export const sellerSideResearchService = async (file?: Express.Multer.File) => {
  if (!file) {
    return {
      status: 500,
      message: "File required",
      sellSideResults: null,
    };
  }
  try {
    const data = await parseExcelFile(file);

    const campaignData = parseCampaignData(
      data.settingsSheet.map((row: any) => [0, row.setting || "", row.value])
    );
    console.log("[CAMPAIGN DATA]:", campaignData);

    const { industries } = await extractAndFilterSettings(data.settingsSheet);

    const caseStudyMappings = await storeMappings(
      campaignData.MarketFocus.Industries,
      campaignData.MarketFocus.Functions,
      data?.caseStudiesSheet,
      data.settingsSheet,
      conductAWSBedrockQuery
    );

    console.log("[CASE STUDIES]:", caseStudyMappings);

    const replacements = {
      company_name: campaignData.CampaignDetails["Company Name"] || "",
      industries: campaignData.MarketFocus.Industries.join(","),
    };

    const categorizedQuestions = categorizeQuestions(data.sellSideSheet);

    console.log(
      "[CATEGORIZED QUESTIONS]:",
      JSON.stringify(categorizedQuestions, null, 2)
    );

    const sellSideResults = await processQuestionsByCategory(
      categorizedQuestions,
      replacements,
      conductAWSBedrockQuery,
      data.personasSheet,
      caseStudyMappings,
      industries,
      campaignData.MarketFocus.Functions
    );

    console.log("[SELLER SIDE RESULTS]:", sellSideResults);

    await saveSellSideResearch(
      sellSideResults,
      campaignData?.CampaignDetails["Product id"] || Math.random(),
      campaignData.CampaignDetails["Product Category"] || ""
    );

    return {
      status: 200,
      message: "Successfully got seller-side results",
      sellSideResults: sellSideResults,
    };
  } catch (err) {
    console.log("[ERROR has occurred]:", err);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const processBatch = async (
  items: any[],
  batchSize: number,
  processFunction: (item: any) => Promise<any>
): Promise<any[]> => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(
      `[BATCH ${i / batchSize + 1}]: Processing ${batch.length} items.`
    );
    const batchResults = await Promise.all(batch.map(processFunction));
    results.push(...batchResults);
  }
  return results;
};

const saveSellSideResearch = async (
  data: any,
  productId: number,
  topicId: string
) => {
  try {
    const entries = [];

    if (data.self_intro.length > 0) {
      entries.push({
        category: "self_intro",
        topicId,
        productId,
        industry1: data.self_intro[0]?.answer || null,
      });
    }

    data.value_prop.forEach((batch: any[], index: number) => {
      const entry: any = {
        category: "value_prop",
        topicId,
        productId,
      };

      batch.slice(0, 5).forEach((item: any, i: number) => {
        entry[`industry${i + 1}`] = item.answer || null;
      });

      entries.push(entry);
    });

    data.case_study.forEach((batch: any[], index: number) => {
      const entry: any = {
        category: "case_study",
        topicId,
        productId,
      };

      batch.slice(0, 5).forEach((item: any, i: number) => {
        entry[`function${i + 1}`] = item.answer || null;
      });

      entries.push(entry);
    });

    await prisma.sellSideScript_temp.createMany({
      data: entries,
    });

    console.log("Data successfully saved to SellSideScript_temp table.");
  } catch (error) {
    console.error("Error saving SellSideScript data:", error);
  }
};
