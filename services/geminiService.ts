import { GoogleGenAI, Type } from "@google/genai";
import { ArtStyle, GeneratedSlide } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates creative image prompts based on the song title and chosen style.
 * We use the text model to "imagine" what the song looks like.
 */
export const generateImagePrompts = async (
  songTitle: string,
  style: ArtStyle,
  count: number = 5
): Promise<string[]> => {
  try {
    const prompt = `
      I have a song titled "${songTitle}".
      Please generate ${count} distinct, creative, and visual image descriptions that would fit a music video for this song.
      The art style must be specifically: ${style}.
      Make the descriptions vivid, colorful, and suitable for an AI image generator.
      Ensure the descriptions capture the "vibe" of the song title and the specific art style requested.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const jsonStr = response.text || "[]";
    const prompts = JSON.parse(jsonStr) as string[];
    
    // Fallback if parsing fails or returns empty
    if (!prompts || prompts.length === 0) {
      return Array(count).fill(`${style} artwork of ${songTitle}`);
    }

    return prompts.slice(0, count);
  } catch (error) {
    console.error("Error generating prompts:", error);
    // Fallback prompts
    return Array(count).fill(`A beautiful ${style} illustration inspired by the song ${songTitle}`);
  }
};

/**
 * Generates a single image from a prompt using Gemini Image Generation.
 */
export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9", // Cinematic for slideshow
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

/**
 * Orchestrates the full generation process.
 */
export const generateSlideshowContent = async (
  songTitle: string,
  style: ArtStyle,
  onProgress: (completed: number, total: number) => void
): Promise<GeneratedSlide[]> => {
  
  // 1. Generate Text Prompts
  const prompts = await generateImagePrompts(songTitle, style, 6); // Generate 6 slides
  const total = prompts.length;
  const slides: GeneratedSlide[] = [];

  // 2. Generate Images in Parallel (with limited concurrency to avoid hitting rate limits too hard)
  // We'll do chunks of 2
  const chunkSize = 2;
  for (let i = 0; i < total; i += chunkSize) {
    const chunk = prompts.slice(i, i + chunkSize);
    const promises = chunk.map(async (promptText, idx) => {
      const base64Image = await generateImage(promptText);
      if (base64Image) {
        return {
          id: `slide-${i + idx}`,
          imageUrl: base64Image,
          prompt: promptText,
        };
      }
      return null;
    });

    const results = await Promise.all(promises);
    const validResults = results.filter((r): r is GeneratedSlide => r !== null);
    slides.push(...validResults);
    
    onProgress(slides.length, total);
  }

  return slides;
};
