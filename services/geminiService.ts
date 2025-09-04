// services/geminiService.ts

import { GoogleGenAI, Modality } from "@google/genai";
import { ImageData } from '../types';

let ai: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
  if (!ai) {
    // TUTAJ JEST POPRAWKA: Używamy import.meta.env, tak jak wymaga tego Vite
    ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  }
  return ai;
};

export const editImage = async (
  images: ImageData[],
  prompt: string,
  referenceImage?: ImageData
): Promise<ImageData | null> => {
  try {
    const aiInstance = getAi();

    const allImages = [...images];
    if (referenceImage) {
        allImages.push(referenceImage);
    }

    const imageParts = allImages.map(image => ({
      inlineData: {
        data: image.base64.split(',')[1],
        mimeType: image.mimeType,
      },
    }));

    let finalPrompt = `(Polish instructions) Based on the user's request: "${prompt}", photorealistically edit the provided photo(s). IMPORTANT: Respond ONLY with the edited image, no text. Maintain original proportions and perspective where applicable.`;

    if (referenceImage) {
        finalPrompt = `(Polish instructions) Photorealistically edit the FIRST image based on the user's request: "${prompt}". Use the SECOND image as a visual and stylistic reference for the changes. If the prompt is empty, rely solely on the style of the reference image. IMPORTANT: Respond ONLY with the edited image, no text. Maintain original proportions and perspective where applicable.`
    }

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          ...imageParts,
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newMimeType = part.inlineData.mimeType;
          const newBase64 = `data:${newMimeType};base64,${part.inlineData.data}`;
          return { base64: newBase64, mimeType: newMimeType };
        }
      }
    }
    throw new Error('No image was generated in the response.');
  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    throw error;
  }
};