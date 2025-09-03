
import React from 'react';
import type { GeneratedAssets } from '../types';
import { DownloadIcon, RefreshIcon } from './icons';

interface ResultDisplayProps {
  assets: GeneratedAssets;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ assets, onReset }) => {
  
  const handleDownload = () => {
    const blob = new Blob([assets.stlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.stl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-8 border border-gray-700 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">Generated 3D Renders</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {assets.images.map((imgSrc, index) => (
            <div key={index} className="aspect-square bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
              <img src={imgSrc} alt={`Render ${index + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">Simulated STL Model</h2>
        <div className="relative">
          <pre className="bg-gray-900/50 text-gray-300 p-4 rounded-lg border border-gray-700 max-h-72 overflow-auto text-xs">
            <code>{assets.stlContent}</code>
          </pre>
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-cyan-600 rounded-md transition-colors text-gray-300 hover:text-white"
            title="Download STL"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center justify-center py-2 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300"
        >
          <RefreshIcon className="w-5 h-5 mr-2"/>
          Start Over
        </button>
      </div>
    </div>
  );
};
