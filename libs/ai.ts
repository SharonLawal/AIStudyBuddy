import { QuizQuestion } from "../types";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

interface GenerateOptions {
  text: string;
  file?: {
    mimeType: string;
    data: string;
  };
}

export const AIService = {
  async generateSummary({ text, file }: GenerateOptions): Promise<string> {
    if (!API_KEY) throw new Error("Missing Gemini API Key");

    const prompt = `
      You are an expert academic tutor. Analyze the provided content (text and/or file).
      
      INSTRUCTIONS:
      1. Extract the most important concepts, definitions, and dates.
      2. Ignore system metadata, scrambled text, or non-educational headers.
      3. Format the output with clear HEADINGS, BULLET POINTS, and a CONCLUSION.
      
      USER NOTES:
      ${text}
    `;

    const requestBody: any = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...(file ? [{ inline_data: { mime_type: file.mimeType, data: file.data } }] : [])
          ]
        }
      ]
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Failed to generate summary. Please try again."
      );
    } catch (error) {
      console.error("AI Summary Error:", error);
      return "Error connecting to AI service.";
    }
  },

  async generateQuiz({ text, file }: GenerateOptions): Promise<QuizQuestion[]> {
    if (!API_KEY) throw new Error("Missing Gemini API Key");

    const prompt = `
      Create a multiple-choice quiz based on the provided content. 
      Return ONLY a raw JSON array. Do not include markdown formatting (no \`\`\`json).
      
      Format:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": 0
        }
      ]

      USER NOTES:
      ${text}
    `;

    const requestBody: any = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...(file ? [{ inline_data: { mime_type: file.mimeType, data: file.data } }] : [])
          ]
        }
      ]
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

      rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(rawText);
    } catch (error) {
      console.error("AI Quiz Error:", error);
      return [];
    }
  },
};