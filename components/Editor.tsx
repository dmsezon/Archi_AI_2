

import React, { useState, useCallback, useEffect } from 'react';
import { Project, ImageData } from '../types';
import { editImage } from '../services/geminiService';
import ControlPanel from './ControlPanel';
import ImagePanel from './ImagePanel';
import LoadingOverlay from './LoadingOverlay';

interface EditorProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onResetProject: () => void;
}

const EXTERIOR_PROMPT_FRAGMENTS: { [key: string]: string } = {
    extract_project: 'Całkowicie usuń istniejące tło i otoczenie, zastępując je neutralnym, jednolitym tłem. Skup się wyłącznie na budynku.',
    place_on_lot: 'Umieść budynek na płaskiej, kwadratowej działce, w całości pokrytej idealnie skoszonym, zielonym trawnikiem. Dodaj proste, nowoczesne ogrodzenie w kolorze antracytowym, w odległości około 6 metrów od każdej ze ścian budynku.',
    generate_with_garden: 'Stwórz bujny, zróżnicowany ogród wokół domu, z kwiatami, krzewami i kilkoma drzewami. Zadbaj o estetyczną kompozycję roślinności.',
    keep_surroundings: 'Zachowaj istniejące otoczenie (drzewa, sąsiednie budynki, ukształtowanie terenu) w nienaruszonym stanie. Twoim zadaniem jest wyłącznie fotorealistyczne wykończenie samego budynku, idealnie wpasowując go w istniejący krajobraz.',
    modern_barn_style: 'Nadaj budynkowi styl nowoczesnej stodoły. Użyj dachu z blachy na rąbek stojący w kolorze antracytowym. Na elewacji połącz pionowe deski z ciemnego drewna z fragmentami gładkiego, białego tynku. Zastosuj duże, nowoczesne przeszklenia.',
    add_garage: 'Jeśli budynek nie ma garażu, dobuduj do niego estetycznie dopasowany, nowoczesny garaż dwustanowiskowy z płaskim dachem.'
};


const Editor: React.FC<EditorProps> = ({ project, setProject, onResetProject }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentImage = project.history.length > 0 
    ? project.history[project.currentVersion - 1] 
    : project.originalImages[0];

  const handleGenerateBase = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Generowanie wizualizacji bazowej...');
    setError(null);

    const basePrompt = 'WAŻNE: Przed przystąpieniem do zadania, usuń ze zdjęcia bazowego wszelkie znaki wodne, logotypy lub tekst. Następnie na podstawie załączonego zdjęcia z budowy, stwórz jedną, spójną, fotorealistyczną wizualizację budynku z elewacją wykończoną gładkim, białym tynkiem. Kluczowe jest, aby finalny obraz przedstawiał budynek w stanie całkowicie wykończonym, gotowym do zamieszkania i był całkowicie pozbawiony jakichkolwiek cech budynku w budowie. Zadbaj o najwyższy poziom fotorealizmu i szczegółowości, wiernie odwzorowując układ okien, ścian, dachu, drzwi i wszystkich kluczowych elementów konstrukcyjnych z oryginalnego zdjęcia. Szczególnie ważne jest zachowanie funkcji otworów w ścianach: jeśli na zdjęciu widać otwór na okno, ma on pozostać oknem; otwór na drzwi ma pozostać drzwiami, a brama garażowa - bramą garażową. Nie zmieniaj ich przeznaczenia. Ukończ wszystkie niewykończone elementy widoczne na zdjęciu (np. brak tynku, niedokończony dach, brak rynien). Jako pozostałe materiały użyj dachówki w kolorze antracytu i prostych okien. Stwórz czyste, dopracowane tło do dalszej pracy.';
    
    let finalPrompt = basePrompt;
    project.initialOptions?.forEach(optionId => {
        if (EXTERIOR_PROMPT_FRAGMENTS[optionId]) {
            finalPrompt += ` ${EXTERIOR_PROMPT_FRAGMENTS[optionId]}`;
        }
    });
      
    try {
      const result = await editImage(
        project.originalImages,
        finalPrompt
      );
      if (result) {
        setProject(p => p ? ({ ...p, history: [result], currentVersion: 1 }) : null);
      }
    } catch (err) {
      setError('Nie udało się wygenerować wizualizacji bazowej. Sprawdź, czy klucz API jest poprawnie skonfigurowany.');
    } finally {
      setIsLoading(false);
    }
  }, [project.originalImages, setProject, project.initialOptions]);

  useEffect(() => {
    if (project.history.length === 0) {
      handleGenerateBase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = useCallback(async (prompt: string, message: string, referenceImage?: File) => {
    if (project.history.length === 0) {
        setError('Poczekaj na wygenerowanie wizualizacji bazowej przed edycją.');
        return;
    }
    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);

    let referenceImageData: ImageData | undefined = undefined;

    if (referenceImage) {
        try {
            referenceImageData = await new Promise<ImageData>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        base64: reader.result as string,
                        mimeType: referenceImage.type,
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(referenceImage);
            });
        } catch (error) {
            setError('Nie udało się wczytać obrazka referencyjnego.');
            setIsLoading(false);
            return;
        }
    }

    try {
      const imageToEdit = project.history[project.currentVersion - 1];
      const result = await editImage([imageToEdit], prompt, referenceImageData);
      if (result) {
        setProject(p => {
          if (!p) return null;
          const newHistory = p.history.slice(0, p.currentVersion);
          newHistory.push(result);
          return { ...p, history: newHistory, currentVersion: newHistory.length };
        });
      }
    } catch (err) {
      setError('Wystąpił błąd podczas edycji. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }, [project, setProject]);

  const handleUndo = () => {
    setProject(p => p && p.currentVersion > 1 ? { ...p, currentVersion: p.currentVersion - 1 } : p);
  };

  const handleRedo = () => {
    setProject(p => p && p.currentVersion < p.history.length ? { ...p, currentVersion: p.currentVersion + 1 } : p);
  };
  
  const handleSaveVersion = (name: string) => {
    const imageToSave = project.history[project.currentVersion - 1];
    if (!imageToSave) return;
    const versionName = name || `Wersja ${project.savedVersions.length + 1}`;
    setProject(p => p ? ({
      ...p,
      savedVersions: [...p.savedVersions, { name: versionName, image: imageToSave }]
    }) : p);
  };

  const handleUpscale = useCallback(async () => {
    if (project.history.length === 0) {
        setError('Poczekaj na wygenerowanie wizualizacji bazowej przed edycją.');
        return;
    }
    setIsLoading(true);
    setLoadingMessage('Powiększanie obrazu i poprawa szczegółów...');
    setError(null);
    try {
      const imageToEdit = project.history[project.currentVersion - 1];
      const prompt = 'Upscale the image to a higher resolution, significantly enhancing details and textures while maintaining photorealism. Do not change the composition, objects, or style of the image.';
      const result = await editImage([imageToEdit], prompt);
      if (result) {
        setProject(p => {
          if (!p) return null;
          const newHistory = p.history.slice(0, p.currentVersion);
          newHistory.push(result);
          return { ...p, history: newHistory, currentVersion: newHistory.length };
        });
      }
    } catch (err) {
      setError('Wystąpił błąd podczas powiększania. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  }, [project, setProject]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <ImagePanel
        projectName={project.name}
        image={currentImage}
        originalImages={project.originalImages}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={project.currentVersion > 1}
        canRedo={project.currentVersion < project.history.length}
        onResetProject={onResetProject}
        onSaveVersion={handleSaveVersion}
        savedVersions={project.savedVersions}
        setProject={setProject}
        onRegenerate={handleGenerateBase}
        onUpscale={handleUpscale}
      />
      <ControlPanel onEdit={handleEdit} />
      {error && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-red-800 text-white py-2 px-4 rounded-lg shadow-lg z-20">
          {error}
        </div>
      )}
    </div>
  );
};

export default Editor;
