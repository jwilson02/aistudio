
import { GoogleGenAI } from "@google/genai";
import type { GeneratedAssets } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export const getObjectDescription = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const textPart = {
    text: `Identify the '${prompt}' in the image. Generate a highly detailed, descriptive paragraph about its 3D shape, form, texture, and key geometric features. This description will be used to create a 3D model, so be specific about its contours, depth, and structure from all angles.`
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
};

const generateRenderedImages = async (description: string): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a photorealistic 3D render of the following object on a neutral grey studio background with soft lighting: ${description}`,
        config: {
            numberOfImages: 4,
            aspectRatio: '1:1',
            outputMimeType: 'image/png'
        }
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
};

const generateStlContent = async (description: string): Promise<string> => {
    const systemInstruction = `You are an expert in 3D modeling. Your task is to generate a simplified ASCII STL file format representation based on a textual description of an object. The STL should be syntactically correct but is for illustrative purposes. Do not include any explanation, just the STL code. Start with "solid object" and end with "endsolid object".`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate an ASCII STL representation for this object: ${description}`,
        config: {
          systemInstruction,
        }
    });
    
    // Clean up potential markdown code blocks
    let stlText = response.text;
    if (stlText.startsWith('```stl')) {
        stlText = stlText.substring(5);
    } else if (stlText.startsWith('```')) {
        stlText = stlText.substring(3);
    }
    if (stlText.endsWith('```')) {
        stlText = stlText.slice(0, -3);
    }
    return stlText.trim();
};


export const generate3dAssets = async (description: string): Promise<GeneratedAssets> => {
  try {
    const [images, stlContent] = await Promise.all([
      generateRenderedImages(description),
      generateStlContent(description),
    ]);

    return { images, stlContent };
  } catch (error) {
    console.error("Failed to generate 3D assets:", error);
    throw new Error("There was an issue generating the 3D model assets from the description.");
  }
};
