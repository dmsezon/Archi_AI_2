// services/authService.ts

import { auth } from './firebase'; // Importujemy skonfigurowaną instancję auth
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

// Tworzymy "dostawcę" logowania Google
const provider = new GoogleAuthProvider();

// Funkcja do logowania
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    // Po udanym logowaniu, zwracamy obiekt użytkownika
    return result.user;
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    return null;
  }
};

// Funkcja do wylogowywania
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Błąd podczas wylogowywania:", error);
  }
};