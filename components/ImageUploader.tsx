
import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onGenerate: (imageFile: File, prompt: string) => void;
  error: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onGenerate, error }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (imageFile && prompt) {
      onGenerate(imageFile, prompt);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-700 transition-all duration-300 ease-in-out">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
            1. Upload Image
          </label>
          <label
            className={`flex justify-center w-full h-64 px-4 transition bg-gray-900/50 border-2 ${
              imagePreview ? 'border-cyan-500' : 'border-gray-600 border-dashed'
            } rounded-md appearance-none cursor-pointer hover:border-cyan-400 focus:outline-none`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
            ) : (
              <span className="flex items-center space-x-2">
                <UploadIcon className="w-6 h-6 text-gray-500" />
                <span className="font-medium text-gray-400">
                  Drop an image, or <span className="text-cyan-400">click to browse</span>
                </span>
              </span>
            )}
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            2. Describe the Object to Model
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'the red coffee mug'"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!imageFile || !prompt}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          Generate 3D Model
        </button>
      </form>
    </div>
  );
};
