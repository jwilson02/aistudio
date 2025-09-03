
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { LogoIcon } from './components/icons';
import { getObjectDescription, generate3dAssets } from './services/geminiService';
import type { GeneratedAssets } from './types';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (imageFile: File, prompt: string) => {
    setAppState(AppState.LOADING);
    setError(null);
    setGeneratedAssets(null);

    try {
      const reader = new FileReader();
      const fileReadPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
          } else {
            reject(new Error('Failed to read file as base64 string.'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const base64Image = await fileReadPromise;
      const mimeType = imageFile.type;

      const description = await getObjectDescription(base64Image, mimeType, prompt);
      if (!description) {
        throw new Error('Could not generate a description for the object.');
      }
      
      const assets = await generate3dAssets(description);
      setGeneratedAssets(assets);
      setAppState(AppState.RESULT);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.IDLE);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setGeneratedAssets(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <ImageUploader onGenerate={handleGenerate} error={error} />;
      case AppState.LOADING:
        return <Loader />;
      case AppState.RESULT:
        return generatedAssets && <ResultDisplay assets={generatedAssets} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl flex items-center justify-center mb-6">
        <LogoIcon className="w-10 h-10 mr-3 text-cyan-400" />
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          Multi-Angle Voxelized 3D Model Generator
        </h1>
      </header>
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center">
        {renderContent()}
      </main>
      <footer className="w-full max-w-4xl text-center text-gray-500 mt-8 text-sm">
        <p>Powered by Gemini. Creates STL models from multi-angle composite analysis.</p>
      </footer>
    </div>
  );
};

export default App;
