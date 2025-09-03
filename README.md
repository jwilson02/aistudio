<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Multi-Angle Voxelized 3D Model Generator

This application creates STL files by taking multiple composites of the same object from different angles and voxelizing them into a comprehensive 3D model.

View your app in AI Studio: https://ai.studio/apps/drive/16wpdc2WjTCTDAa43y1wM1DrY6Fo7rVx3

## Features

- **Multi-Angle Analysis**: Generates 8 strategic viewpoints of objects:
  - Front view
  - Back view  
  - Left side view
  - Right side view
  - Top view
  - Bottom view
  - Front-left diagonal view
  - Front-right diagonal view

- **Voxelization Process**: Creates STL models using AI-based voxelization that considers geometric features from all camera angles

- **Comprehensive 3D Reconstruction**: The resulting mesh incorporates details visible from multiple viewpoints for a complete 3D representation

## How It Works

1. **Upload an image** containing the object you want to model
2. **Describe the object** you want to extract from the image
3. **AI Analysis**: The system uses Gemini AI to analyze the object's 3D geometry
4. **Multi-Angle Generation**: Creates 8 different rendered views using strategic camera positions
5. **Voxelization**: Generates an STL file that incorporates geometric data from all viewpoints

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Technical Details

The application uses:
- **Gemini 2.5 Flash** for object description and STL generation
- **Imagen 4.0** for multi-angle 3D render generation
- **Voxelization algorithms** simulated through AI to create comprehensive 3D models
- **React + TypeScript** for the user interface

The STL generation process simulates taking multiple camera viewpoints and combining them through voxelization to create a single, coherent 3D model file.
