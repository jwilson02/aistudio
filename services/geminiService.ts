
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
    text: `Identify the '${prompt}' in the image. Generate a highly detailed, descriptive paragraph about its 3D shape, form, texture, and key geometric features from all possible viewing angles. 

Focus on:
- Overall 3D geometry and proportions
- Surface textures and materials
- Key features visible from front, back, sides, top, and bottom views
- Structural details that would be important for 3D reconstruction
- How the object would appear when viewed from different diagonal angles

This description will be used to create comprehensive multi-angle renders and a voxelized 3D model, so be specific about its contours, depth, structure, and distinguishing features that would be captured from multiple camera viewpoints.`
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
};

const generateRenderedImages = async (description: string): Promise<string[]> => {
    // Generate images from multiple strategic angles for comprehensive 3D coverage
    const viewpoints = [
        "front view",
        "back view", 
        "left side view",
        "right side view",
        "top view",
        "bottom view",
        "front-left diagonal view at 45 degrees",
        "front-right diagonal view at 45 degrees"
    ];

    const allImages: string[] = [];

    // Generate images in batches to stay within API limits
    for (let i = 0; i < viewpoints.length; i += 4) {
        const batch = viewpoints.slice(i, i + 4);
        const batchPrompts = batch.map(viewpoint => 
            `Create a photorealistic 3D render of the following object from ${viewpoint} on a neutral grey studio background with soft lighting, optimal for 3D reconstruction: ${description}`
        );

        // Generate each image in the batch
        const batchImages = await Promise.all(
            batchPrompts.map(async (prompt) => {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt,
                    config: {
                        numberOfImages: 1,
                        aspectRatio: '1:1',
                        outputMimeType: 'image/png'
                    }
                });
                return `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
            })
        );

        allImages.push(...batchImages);
    }

    return allImages;
};

const generateStlContent = async (description: string): Promise<string> => {
    const systemInstruction = `You are an expert in 3D modeling and voxelization. Your task is to generate a realistic ASCII STL file format representation based on a textual description of an object. 

This STL should simulate the result of a voxelization process that would combine multiple camera viewpoints (front, back, left, right, top, bottom, and diagonal views) into a single coherent 3D model. 

The STL should be syntactically correct with proper triangle mesh definitions. Create a more detailed mesh with multiple triangular facets that represent the object's geometry from all angles. Include facets that would capture features visible from different viewpoints.

Use realistic vertex coordinates and normal vectors. Start with "solid object" and end with "endsolid object". Do not include any explanation, just the STL code.`;
    
    const prompt = `Generate a comprehensive ASCII STL representation for this object that incorporates geometric details that would be captured from multiple camera angles (front, back, sides, top, bottom, diagonals) during a voxelization process: ${description}

The STL should have enough triangular facets to represent the object's 3D structure comprehensively, as if reconstructed from multiple viewpoint images.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
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
