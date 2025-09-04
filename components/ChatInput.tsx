

import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onPromptSubmit: (prompt: string, message: string, referenceImage?: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || referenceImage) {
      const message = prompt.trim() ? `Wykonywanie polecenia: ${prompt}...` : `Stosowanie obrazka referencyjnego...`
      onPromptSubmit(prompt, message, referenceImage || undefined);
      setPrompt('');
      handleRemoveImage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Asystent AI</label>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="np. Zmień elewację na taką jak na zdjęciu"
                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="reference-image-upload"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`${referenceImage ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-gray-500 text-white font-semibold p-2 rounded-lg transition-colors`}
                title="Dodaj obrazek referencyjny"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </button>
        </div>
        {referenceImage && (
            <div className="relative group w-24 h-16">
                <img src={URL.createObjectURL(referenceImage)} alt="Reference" className="w-full h-full object-cover rounded-md" />
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Usuń obrazek referencyjny"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )}
      </form>
      <p className="text-xs text-gray-500 mt-2">Opisz zmiany lub dodaj obrazek referencyjny.</p>
    </div>
  );
};

export default ChatInput;
