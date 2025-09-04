import type { ReactElement } from 'react';

export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface Project {
  name: string;
  originalImages: ImageData[];
  history: ImageData[];
  currentVersion: number;
  savedVersions: { name: string; image: ImageData }[];
  initialOptions?: string[];
}

export interface Preset {
  name: string;
  prompt: string;
  // Fix: Changed JSX.Element to ReactElement to avoid namespace errors in .ts files.
  icon: ReactElement;
}