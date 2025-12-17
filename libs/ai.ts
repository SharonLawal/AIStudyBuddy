import { QuizQuestion } from "../types";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

interface GenerateOptions {
  text: string;
  file?: {
    mimeType: string;
    data: string;
  };
  questionCount?: number;
}

export const AIService = {
  async generateSummary({ text, file }: GenerateOptions): Promise<string> {
    if (!API_KEY) throw new Error("Missing Gemini API Key");

    const prompt = `
      You are an expert academic tutor. Analyze the provided content.
      
      TASK:
      1. Read the document text thoroughly.
      2. Extract the core concepts, definitions, and key dates.
      3. Create a structured summary with:
         - 🎯 **Main Topic**
         - 🔑 **Key Concepts** (Bullet points)
         - 📝 **Detailed Explanation**
         - ✅ **Conclusion**

      USER NOTES:
      ${text}
    `;

    // Only attach file if it's NOT text (e.g. PDF images)
    // If we extracted text from PPTX, 'file' will be undefined, which saves quota!
    const contents: any[] = [{
      parts: [
        { text: prompt },
        ...(file ? [{ inline_data: { mime_type: file.mimeType, data: file.data } }] : [])
      ]
    }];

    try {
      // ✅ UPDATE: Use 'gemini-2.5-flash-lite' (Stable & Free Tier Friendly)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        // Handle specific API errors
        if (data.error.code === 404) throw new Error("Model not found. Try updating the model name.");
        if (data.error.code === 429) throw new Error("Quota Exceeded. Please wait a moment.");
        throw new Error(data.error.message);
      }
      
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
    } catch (error: any) {
      console.error("AI Summary Error:", error);
      return `Error: ${error.message || "Could not connect to AI."}`;
    }
  },

  async generateQuiz({ text, file, questionCount = 5 }: GenerateOptions): Promise<QuizQuestion[]> {
    if (!API_KEY) throw new Error("Missing Gemini API Key");

    const prompt = `
      Create a multiple-choice quiz with exactly ${questionCount} questions from this content.
      STRICT JSON FORMAT ONLY. No markdown.
      [{"question": "...", "options": ["A", "B", "C", "D"], "answer": 0}]
      
      USER NOTES:
      ${text}
    `;

    const contents: any[] = [{
      parts: [
        { text: prompt },
        ...(file ? [{ inline_data: { mime_type: file.mimeType, data: file.data } }] : [])
      ]
    }];

    try {
      // ✅ UPDATE: Use 'gemini-2.5-flash-lite'
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(rawText);
    } catch (error) {
      console.error("AI Quiz Error:", error);
      return [];
    }
  },
};