import { QuizQuestion } from "../types";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const AIService = {
  async generateSummary(text: string): Promise<string> {
    if (!API_KEY) throw new Error("Missing Gemini API Key");

    const prompt = `You are an expert study buddy. Summarize the following study notes into key bullet points and a brief conclusion. Keep it concise and easy to learn from.\n\nNotes:\n${text}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Failed to generate summary."
      );
    } catch (error) {
      console.error("AI Summary Error:", error);
      return "Error connecting to AI service.";
    }
  },

  async generateQuiz(text: string): Promise<QuizQuestion[]> {
    if (!API_KEY) throw new Error("Missing Gemini API Key");

    const prompt = `Generate a quiz based on these notes. Return ONLY a valid JSON array. Do not wrap in markdown (no \`\`\`json blocks). Format: [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": 0 }]. (Answer is the index 0-3).\n\nNotes:\n${text}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

      const jsonString = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(jsonString);
    } catch (error) {
      console.error("AI Quiz Error:", error);
      return [];
    }
  },
};
