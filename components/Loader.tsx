
import React, { useState, useEffect } from 'react';
import { CubeIcon } from './icons';

const loadingMessages = [
  "Analyzing image geometry from multiple angles...",
  "Generating comprehensive 3D object description...",
  "Capturing front and back viewpoints...",
  "Rendering left and right side views...",
  "Creating top and bottom perspectives...",
  "Generating diagonal angle composites...",
  "Performing voxelization analysis...",
  "Building multi-angle polygonal mesh...",
  "Finalizing your composite STL model...",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
      <CubeIcon className="w-16 h-16 text-cyan-400 animate-spin-slow" />
      <h2 className="text-xl font-semibold text-gray-200">Generating Multi-Angle 3D Model</h2>
      <p className="text-gray-400 text-center min-h-[2.5rem] w-80">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
