
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

const backgroundImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [bgIndex]);

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
        {backgroundImages.map((url, index) => (
            <div 
                key={index} 
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105 ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`} 
                style={{ backgroundImage: `url(${url})` }} 
            />
        ))}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                Witaj w <span className="text-blue-400">Archi_AI_2</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Przekształć zdjęcia z budowy w oszałamiające, fotorealistyczne wizualizacje. Eksperymentuj z materiałami, stylami i otoczeniem za pomocą kilku kliknięć.
            </p>
            <button
                onClick={onStart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
                Rozpocznij
            </button>
        </div>
    </div>
  );
};

export default SplashScreen;