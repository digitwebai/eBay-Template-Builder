import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDescription = async (productName: string, keyFeatures: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a persuasive and professional product description for an eBay listing.
      
      Product Name: ${productName}
      Key Features/Keywords: ${keyFeatures}
      
      Keep it concise (approx 2-3 sentences). Focus on benefits and ease of use. Do not use markdown formatting like **bold**.`,
    });
    
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please check your API key.";
  }
};

export const optimizeTitle = async (currentTitle: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Optimize this eBay product title for SEO and click-through rate. Keep it under 80 characters if possible, but prioritize keywords.
      
      Current Title: ${currentTitle}
      
      Return ONLY the optimized title text.`,
    });

    return response.text || currentTitle;
  } catch (error) {
    console.error("Gemini Error:", error);
    return currentTitle;
  }
};