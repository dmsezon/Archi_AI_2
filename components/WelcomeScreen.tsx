import React, { useState, useCallback, useEffect } from 'react';

interface WelcomeScreenProps {
  onProjectCreate: (name: string, imageFiles: File[], options: string[]) => void;
}

const backgroundImages = [
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

const projectNames = [ 'Dom w Rododendronach', 'Willa Parkowa', 'Apartament w Centrum', 'Loft na Poddaszu', 'Dom przy Słonecznej', 'Projekt Z7', 'Dom w Lukrecji', 'Willa Koralowa', 'Dom w Awokado', 'Rezydencja pod Dębem', 'Dom Marzeń', 'Nowoczesna Stodoła', 'Dom na Wzgórzu', 'Leśna Ostoja', 'Dom przy Cyprysowej', 'Willa Kalina', 'Apartament Leśny', 'Projekt "Wirtualny Kominek"', 'Willa "Bez Kredytu"', 'Dom "U Sąsiada Zawsze Zieleńsze"', 'Rezydencja "Ctrl+S"', 'Chatka "Render Farm"', 'Projekt "404: Dach Not Found"', 'Dworek "Wieczny Beta-Test"', 'Schronienie "Archi_AI_2"', 'Posiadłość "Lorem Ipsum"',
];

const getRandomProjectName = () => projectNames[Math.floor(Math.random() * projectNames.length)];

// -- Initial Generation Options --
const exteriorEnvironmentOptions = [
    { id: 'place_on_lot', title: 'Umieść na działce', description: 'Czysty trawnik i proste ogrodzenie.', icon: '🏞️' },
    { id: 'generate_with_garden', title: 'Wygeneruj z ogrodem', description: 'Bujna roślinność i kwiaty wokół domu.', icon: '🌳' },
    { id: 'keep_surroundings', title: 'Zachowaj otoczenie', description: 'Wykończ tylko budynek, tło bez zmian.', icon: '🖼️' },
    { id: 'extract_project', title: 'Wyodrębnij projekt', description: 'Usuń tło, pozostaw tylko sam budynek.', icon: '✂️' },
];
const exteriorStyleOptions = [
    { id: 'modern_barn_style', title: 'Styl "Nowoczesna Stodoła"', description: 'Ciemny dach, drewno i duże okna.', icon: '🏚️' },
    { id: 'add_garage', title: 'Dodaj garaż', description: 'Dobuduj nowoczesny garaż dwustanowiskowy.', icon: '🚗' },
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onProjectCreate }) => {
  const [projectName, setProjectName] = useState(getRandomProjectName());
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const [environmentOption, setEnvironmentOption] = useState<string>('place_on_lot');
  const [selectedStyleOptions, setSelectedStyleOptions] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [bgIndex]);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const newFile = Array.from(files).find(file => file.type.startsWith('image/'));
    if (!newFile) {
        setError('Proszę wybrać plik graficzny (jpeg, png, webp).');
        return;
    }
    setImageFiles([newFile]);
    setError('');
  };

  const handleRemoveImage = () => {
    setImageFiles([]);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }, [handleFileChange]);

  const handleStyleOptionToggle = (optionId: string) => {
    setSelectedStyleOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && imageFiles.length > 0) {
      const allOptions = [environmentOption, ...selectedStyleOptions].filter(Boolean);
      onProjectCreate(projectName, imageFiles, allOptions);
    } else {
      setError('Proszę nadać nazwę i dodać zdjęcie.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
      {backgroundImages.map((url, index) => (
            <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${index === bgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} style={{ backgroundImage: `url(${url})` }} />
      ))}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-3xl bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Stwórz Nowy Projekt Wizualizacji</h1>
          <p className="text-lg text-gray-400">Wczytaj zdjęcie domu, a AI zamieni je w fotorealistyczny projekt.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">Nazwa Projektu</label>
                <input id="projectName" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="np. Dom w Malinach" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Zdjęcie z Budowy ({imageFiles.length}/1)</label>
                {imageFiles.length > 0 ? (
                    <div className="mb-3">
                        <div className="relative group w-40 mx-auto">
                            <img src={URL.createObjectURL(imageFiles[0])} alt="Preview" className="w-full h-24 object-cover rounded-md" />
                            <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <label
                      htmlFor="file-upload"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-blue-500' : 'border-gray-600'} border-dashed rounded-md cursor-pointer`}
                    >
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-400">
                          <p className="pl-1">lub przeciągnij i upuść</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                      </div>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept="image/*" />
                    </label>
                )}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Wybierz Otoczenie (1 opcja)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {exteriorEnvironmentOptions.map(opt => (
                        <div key={opt.id} onClick={() => setEnvironmentOption(opt.id)} className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${environmentOption === opt.id ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}>
                            <div className="text-2xl mb-1">{opt.icon}</div>
                            <h4 className="font-semibold text-sm text-white">{opt.title}</h4>
                            <p className="text-xs text-gray-400">{opt.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dodaj Elementy Stylu</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {exteriorStyleOptions.map(opt => (
                        <div key={opt.id} onClick={() => handleStyleOptionToggle(opt.id)} className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${selectedStyleOptions.includes(opt.id) ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}>
                            <div className="text-2xl mb-1">{opt.icon}</div>
                            <h4 className="font-semibold text-sm text-white">{opt.title}</h4>
                            <p className="text-xs text-gray-400">{opt.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg" disabled={imageFiles.length === 0 || !projectName}>
              Stwórz Projekt
            </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;