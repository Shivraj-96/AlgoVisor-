
const { GoogleGenAI }= require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "secret_key_here" });

async function analysis(code) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze the following JavaScript code and return its time and space complexity in JSON format like:
{
  "time": "O(...)",
  "space": "O(...)"
}

Code:
${code}`
            }
          ]
        }
      ]
    });

    // Access candidates directly on result, not result.response
    const candidates = result?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response candidates found from AI");
    }

    const text = candidates[0].content.parts[0].text;

    const cleaned = text.replace(/```json|```/g, "").trim();
    console.log("Cleaned JSON string:", cleaned);

    const parsed = JSON.parse(cleaned);
console.log(parsed);
    return parsed;

  } catch (error) {
    console.error("❌ Analysis failed:", error);
    return {
      error: "Analysis failed",
      details: error.message,
    };
  }
}

module.exports = { analysis };
