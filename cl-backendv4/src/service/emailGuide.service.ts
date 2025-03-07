import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const EmailGuideService = async (req?: string) => {
    console.log("[REQ in SERVICE]:",req);

    if (!req) {
        return {
            message: "Request content is required and cannot be undefined.",
            data: null,
            statusCode: 400
        }
    }
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: req },
            ],
          });

        
        console.log("[COMPLETION RESPONSE]:", response);
        const result: any = response.choices[0].message.content;
        console.log("[DESTRUCTURED FINAL RESULT]:", result);
        return {
            statusCode: 200,
            message: "Successfully generated a result.",
            data: result
        };
    } catch (error) {
        console.log("[ERROR OCCURED IN THE COMPLETION]:",error);
        return {
            statusCode: 500,
            message: "Some internal server error has occurred.",
            data: null
        };
    }
}