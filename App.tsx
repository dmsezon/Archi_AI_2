import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Editor from './components/Editor';
import { Project } from './types';
import SplashScreen from './components/SplashScreen';

type AppState = 'splash' | 'welcome' | 'editor';

const App: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [appState, setAppState] = useState<AppState>('splash');

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

  useEffect(() => {
    if (project) {
      setAppState('editor');
    } else if (appState === 'editor') {
      // Handles reset, go back to welcome screen
      setAppState('welcome');
    }
  }, [project, appState]);


  const renderContent = () => {
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
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;