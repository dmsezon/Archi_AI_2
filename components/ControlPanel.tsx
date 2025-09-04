import React from 'react';
import ChatInput from './ChatInput';
import Accordion from './Accordion';
import {
    FACADE_PRESETS, ENVIRONMENT_PRESETS, LIGHTING_PRESETS, VIEW_PRESETS, ACCESSORIES_PRESETS
} from '../constants';
import type { Preset } from '../types';

interface ControlPanelProps {
  onEdit: (prompt: string, message: string, referenceImage?: File) => void;
}

interface PresetButtonProps {
  preset: Preset;
  onEdit: (prompt: string, message: string) => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({ preset, onEdit }) => (
  <button
    onClick={() => onEdit(preset.prompt, `Stosowanie: ${preset.name}...`)}
    className="flex flex-col items-center justify-center p-2 space-y-1 bg-gray-700/80 hover:bg-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-center w-full aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
    aria-label={preset.name}
  >
    {preset.icon}
    <span className="text-xs font-medium text-gray-200 leading-tight">{preset.name}</span>
  </button>
);

// Icons for Accordion Headers
const FacadeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const EnvironmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 9.3l.065.065a2 2 0 010 2.828l-.065.065m8.5 0l.065.065a2 2 0 000 2.828l-.065.065M12 11v6" /></svg>;
const LightingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;
const AccessoriesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;


const ControlPanel: React.FC<ControlPanelProps> = ({ onEdit }) => {
  return (
    <aside className="md:w-1/4 bg-gray-800 p-4 lg:p-6 flex flex-col space-y-4 overflow-y-auto">
      <ChatInput onPromptSubmit={onEdit} />

      <Accordion title="Elewacja" icon={<FacadeIcon />}>
        <div className="p-3 grid grid-cols-3 gap-3">
          {FACADE_PRESETS.map(preset => <PresetButton key={preset.name} preset={preset} onEdit={onEdit} />)}
        </div>
      </Accordion>

      <Accordion title="Otoczenie" icon={<EnvironmentIcon />}>
        <div className="p-3 grid grid-cols-3 gap-3">
          {ENVIRONMENT_PRESETS.map(preset => <PresetButton key={preset.name} preset={preset} onEdit={onEdit} />)}
        </div>
      </Accordion>

      <Accordion title="Oświetlenie i Pora Dnia" icon={<LightingIcon />}>
        <div className="p-3 grid grid-cols-3 gap-3">
          {LIGHTING_PRESETS.map(preset => <PresetButton key={preset.name} preset={preset} onEdit={onEdit} />)}
        </div>
      </Accordion>

      <Accordion title="Dach i Dodatki" icon={<AccessoriesIcon />}>
        <div className="p-3 grid grid-cols-3 gap-3">
          {ACCESSORIES_PRESETS.map(preset => <PresetButton key={preset.name} preset={preset} onEdit={onEdit} />)}
        </div>
      </Accordion>
      
      <Accordion title="Perspektywa" icon={<ViewIcon />}>
        <div className="p-3 grid grid-cols-3 gap-3">
          {VIEW_PRESETS.map(preset => <PresetButton key={preset.name} preset={preset} onEdit={onEdit} />)}
        </div>
      </Accordion>

    </aside>
  );
};

export default ControlPanel;
