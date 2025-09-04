import React, { useState, useRef } from 'react';
import { Project, ImageData } from '../types';

interface ImagePanelProps {
  projectName: string;
  image: ImageData;
  originalImages: ImageData[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onResetProject: () => void;
  onSaveVersion: (name: string) => void;
  savedVersions: { name: string; image: ImageData }[];
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onRegenerate: () => void;
  onUpscale: () => void;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ projectName, image, originalImages, onUndo, onRedo, canUndo, canRedo, onResetProject, onSaveVersion, savedVersions, setProject, onRegenerate, onUpscale }) => {
  const [versionName, setVersionName] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [isMouseOverImage, setIsMouseOverImage] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleSaveClick = () => {
    onSaveVersion(versionName);
    setVersionName('');
  };

  const handleVersionClick = (image: ImageData) => {
    setProject(p => {
        if (!p) return null;
        const newHistory = p.history.slice(0, p.currentVersion);
        newHistory.push(image);
        return { ...p, history: newHistory, currentVersion: newHistory.length };
    });
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPosition({ x, y });
  };
  
  const getMagnifierStyle = (): React.CSSProperties => {
    if (!imageContainerRef.current) return {};
    
    const loupeSize = 150;
    const zoom = 1.3;

    const { width, height } = imageContainerRef.current.getBoundingClientRect();

    const bgX = `-${magnifierPosition.x * zoom - loupeSize / 2}px`;
    const bgY = `-${magnifierPosition.y * zoom - loupeSize / 2}px`;

    return {
        position: 'absolute',
        left: `${magnifierPosition.x - loupeSize / 2}px`,
        top: `${magnifierPosition.y - loupeSize / 2}px`,
        width: `${loupeSize}px`,
        height: `${loupeSize}px`,
        backgroundImage: `url(${image.base64})`,
        backgroundSize: `${width * zoom}px ${height * zoom}px`,
        backgroundPosition: `${bgX} ${bgY}`,
        backgroundRepeat: 'no-repeat',
    };
  };

  return (
    <main className="flex-grow flex flex-col bg-gray-900 md:w-3/4 p-4 lg:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div>
            <h1 className="text-2xl font-bold text-white">{projectName}</h1>
            <p className="text-sm text-gray-400">Interaktywna wizualizacja</p>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={onRegenerate}
                className="bg-gray-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                title="Stwórz nową wizualizację na podstawie oryginalnego zdjęcia"
            >
                Generuj od Nowa
            </button>
            <button
                onClick={onResetProject}
                className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Nowy Projekt
            </button>
        </div>
      </header>
      
      {/* Main Image */}
      <div 
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsMouseOverImage(true)}
        onMouseLeave={() => setIsMouseOverImage(false)}
        className={`flex-grow bg-black rounded-xl flex items-center justify-center overflow-hidden border border-gray-700 relative ${isMagnifierActive ? 'cursor-crosshair' : ''}`}
      >
        <img src={isComparing ? originalImages[0].base64 : image.base64} alt="Building visualization" className="max-h-full max-w-full object-contain" />
        
        {isMagnifierActive && isMouseOverImage && (
            <div 
                style={getMagnifierStyle()}
                className="border-4 border-white rounded-full pointer-events-none shadow-lg z-10"
            />
        )}

        {isComparing && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-md pointer-events-none">
            Oryginalne Zdjęcie
          </div>
        )}

        {/* History Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
            <button
                onMouseDown={() => setIsComparing(true)}
                onMouseUp={() => setIsComparing(false)}
                onMouseLeave={() => setIsComparing(false)}
                onTouchStart={() => setIsComparing(true)}
                onTouchEnd={() => setIsComparing(false)}
                className="bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full text-white transition"
                title="Przytrzymaj, aby zobaczyć oryginał"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" /></svg>
            </button>
            <button onClick={onUndo} disabled={!canUndo} className="bg-gray-800/80 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 0 1 8 8v2M3 10l4-4m-4 4 4 4" /></svg>
            </button>
            <button onClick={onRedo} disabled={!canRedo} className="bg-gray-800/80 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 0 0-8 8v2m18-10-4-4m4 4-4 4" /></svg>
            </button>
            <button
                onClick={onUpscale}
                className="bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full text-white transition"
                title="Powiększ obraz (Upscale)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </button>
            <button
                onClick={() => setIsMagnifierActive(prev => !prev)}
                className={`${isMagnifierActive ? 'bg-blue-600' : 'bg-gray-800/80'} hover:bg-blue-500 p-2 rounded-full text-white transition`}
                title="Lupa"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
        </div>
      </div>

      {/* Version Management */}
      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-3">Zapisz i porównaj wersje</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="Nazwa wersji (np. Ciemna elewacja)"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <button onClick={handleSaveClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Zapisz Wersję</button>
                </div>

                {savedVersions.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-300 mb-2">Galeria Projektu:</h4>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {savedVersions.map((version, index) => (
                            <div key={index} onClick={() => handleVersionClick(version.image)} className="cursor-pointer group flex-shrink-0">
                                <img src={version.image.base64} alt={version.name} className="w-32 h-20 object-cover rounded-md border-2 border-gray-600 group-hover:border-blue-500 transition-all"/>
                                <p className="text-xs text-center text-gray-400 mt-1 truncate w-32">{version.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-3">Oryginalne zdjęcie</h3>
                <div className="flex gap-2 overflow-x-auto">
                    {originalImages.map((img, index) => (
                         <div key={index} className="flex-shrink-0">
                            <img src={img.base64} alt={`Original ${index + 1}`} className="w-24 h-16 object-cover rounded-md border-2 border-gray-600"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default ImagePanel;