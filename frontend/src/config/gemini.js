import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const geminiConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
    safetySettings: [
        {
            category: HarmCategory.HARASSMENT,
            threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HATE_SPEECH,
            threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
        },
    ],
};

let chatSession = null;

export const getGeminiResponse = async (prompt) => {
    try {
        if (!chatSession) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            chatSession = model.startChat({
                generationConfig: geminiConfig,
                history: [],
            });
        }

        const result = await chatSession.sendMessage(
            prompt + "\n\nRemember to be calm, empathetic, and motivational in your response. Focus on providing support and encouragement."
        );

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error getting Gemini response:", error);
        // Reset chat session on error to prevent cascading failures
        chatSession = null;
        return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
    }
}