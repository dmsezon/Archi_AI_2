// App.tsx (Wersja Ostateczna, Połączona)

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import WelcomeScreen from './components/WelcomeScreen';
import Editor from './components/Editor';
import { Project } from './types';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';

type AppState = 'splash' | 'welcome' | 'editor';

const App: React.FC = () => {
  // === STANY Z TWOJEGO STAREGO KODU ===
  const [project, setProject] = useState<Project | null>(null);
  const [appState, setAppState] = useState<AppState>('splash');
  
  // === NOWE STANY DO OBSŁUGI LOGOWANIA ===
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // === FUNKCJE Z TWOJEGO STAREGO KODU (bez zmian) ===
  const handleProjectCreate = (name: string, imageFiles: File[], options: string[]) => {
    const promises = imageFiles.map(file => {
      return new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            base64: reader.result as string,
            mimeType: file.type,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(images => {
      setProject({
        name,
        originalImages: images,
        history: [],
        currentVersion: 0,
        savedVersions: [],
        initialOptions: options,
      });
    });
  };

  const handleResetProject = () => {
    setProject(null);
  };

  // === EFEKTY Z TWOJEGO STAREGO KODU (bez zmian) ===
  useEffect(() => {
    if (project) {
      setAppState('editor');
    } else if (appState === 'editor') {
      setAppState('welcome');
    }
  }, [project, appState]);

  // === NOWY EFEKT DO OBSŁUGI LOGOWANIA ===
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // === LOGIKA RENDEROWANIA (lekko zmodyfikowana) ===
  const renderContent = () => {
    // Jeśli jeszcze sprawdzamy stan logowania, pokaż ekran ładowania
    if (isAuthLoading) {
      return <SplashScreen onStart={() => {}} />; // Używamy SplashScreen jako ekranu ładowania
    }

    // Jeśli użytkownik nie jest zalogowany, ZAWSZE pokazuj ekran powitalny
    // z prośbą o logowanie.
    // (Później możemy to zmienić, ale na razie to jest bezpieczne)
    // UWAGA: Możemy usunąć ten warunek, jeśli chcesz pozwolić na korzystanie z aplikacji bez logowania.
    if (!user) {
      // Gdy nie ma użytkownika, przechodzimy do ekranu powitalnego po splashu
      if (appState === 'splash') {
        return <SplashScreen onStart={() => setAppState('welcome')} />;
      }
      return <WelcomeScreen onProjectCreate={handleProjectCreate} />;
    }
    
    // Jeśli użytkownik JEST zalogowany, działa Twoja stara logika
    switch (appState) {
      case 'splash':
        return <SplashScreen onStart={() => setAppState('welcome')} />;
      case 'welcome':
        return <WelcomeScreen onProjectCreate={handleProjectCreate} />;
      case 'editor':
        return project ? <Editor project={project} setProject={setProject} onResetProject={handleResetProject} /> : null;
      default:
        return <SplashScreen onStart={() => setAppState('welcome')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans relative">
      {/* Przycisk logowania/wylogowania zawsze widoczny w rogu */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50 }}>
        {!isAuthLoading && <Login user={user} />}
      </div>
      {renderContent()}
    </div>
  );
};

export default App;