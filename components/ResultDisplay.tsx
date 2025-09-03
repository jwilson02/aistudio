
import React from 'react';
import type { GeneratedAssets } from '../types';
import { DownloadIcon, RefreshIcon } from './icons';

interface ResultDisplayProps {
  assets: GeneratedAssets;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ assets, onReset }) => {
  
  // Define viewpoint labels for the multi-angle images
  const viewpointLabels = [
    "Front View",
    "Back View", 
    "Left Side",
    "Right Side",
    "Top View",
    "Bottom View",
    "Front-Left Diagonal",
    "Front-Right Diagonal"
  ];

  const handleDownload = () => {
    const blob = new Blob([assets.stlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multi-angle-voxelized-model.stl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-8 border border-gray-700 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Multi-Angle Composite Views</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Generated from 8 strategic viewpoints for comprehensive 3D reconstruction
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {assets.images.map((imgSrc, index) => (
            <div key={index} className="relative aspect-square bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 group">
              <img 
                src={imgSrc} 
                alt={`${viewpointLabels[index] || `View ${index + 1}`}`} 
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <span className="text-white text-xs font-medium">
                  {viewpointLabels[index] || `View ${index + 1}`}
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Angle {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Voxelized STL Model</h2>
        <p className="text-gray-400 text-center mb-4 text-sm">
          Generated from multi-angle composite analysis and voxelization process
        </p>
        <div className="relative">
          <pre className="bg-gray-900/50 text-gray-300 p-4 rounded-lg border border-gray-700 max-h-72 overflow-auto text-xs">
            <code>{assets.stlContent}</code>
          </pre>
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-cyan-600 rounded-md transition-colors text-gray-300 hover:text-white"
            title="Download Multi-Angle Voxelized STL"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-600">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">About this STL Model:</h3>
          <p className="text-xs text-gray-400">
            This STL file is generated using AI-based voxelization that considers geometric features 
            captured from multiple camera angles. The mesh incorporates details that would be visible 
            from front, back, side, top, bottom, and diagonal viewpoints to create a comprehensive 3D representation.
          </p>
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
