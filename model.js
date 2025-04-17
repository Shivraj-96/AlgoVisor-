import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises"; // Using fs.promises for async file writing

const ai = new GoogleGenAI({ apiKey: "AIzaSyDWrs9XLTFrXmLKiWYeyvCcM4MTUlqUhYg" });

async function analysis(code) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze the following JS code for its time and space complexity in JSON format. Only return a valid JSON response without markdown formatting or backticks.\n\n${code}`,
    });
  
    let analysisResult = response.text;
    analysisResult = analysisResult.replace(/```json|```/g, "").trim();
    await fs.writeFile("analysisResult.json",analysisResult);
    // console.log("Analysis Result:", analysisResult);
    
  } catch (error) {
    console.error("Error during analysis:", error);
  }
}
let code = `
let n = 5;
for (let i = 1; i <= n; i++) {
    let str = '';
    let count = 1;
    for (let j = 1; j <= 2 * n; ++j) {
        if (i + j >= n + 1 && (i >= j - n + 1)) {
            str += count.toString() + ' ';
            count++; 
        } else {
            // Add two spaces for the gap
            str += ' ';
        }
    }
    console.log(str);
};
`;

await analysis(code);