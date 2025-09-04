// components/Login.tsx

import React from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logOut } from '../services/authService'; // Ścieżka do naszych funkcji

interface LoginProps {
  user: User | null; // Komponent przyjmuje dane użytkownika jako "prop"
}

const Login: React.FC<LoginProps> = ({ user }) => {
  if (user) {
    // Jeśli użytkownik JEST zalogowany
    return (
      <div>
        <span>Witaj, {user.displayName}</span>
        {user.photoURL && <img src={user.photoURL} alt="Avatar" style={{width: '30px', borderRadius: '50%', marginLeft: '10px'}} />}
        <button onClick={logOut} style={{marginLeft: '10px'}}>Wyloguj</button>
      </div>
    );
  } else {
    // Jeśli użytkownik NIE JEST zalogowany
    return (
      <button onClick={signInWithGoogle}>Zaloguj się z Google</button>
    );
  }
};

export default Login;