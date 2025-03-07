import axios from "axios";

export const ChatbotService = async (req?: string) => {
    try {
        const response: any = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: req },
                ],
                model: "gpt-4o",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const result: any = response.data.choices[0].message.content;
        return result
    } catch (error) {
        return error;
    }

}