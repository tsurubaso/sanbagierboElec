import { useState, useEffect } from "react";

export default function useGithubSession() {
  const [token, setToken] = useState(null);

  useEffect(() => {

       // ✅ VÉRIFICATION
    if (!window.electronAPI) {
      console.error("❌ electronAPI n'est pas disponible !");
      console.log("window.electronAPI:", window.electronAPI);
      return;
    }
    window.electronAPI.githubSession().then(setToken);

        const unsubscribe = window.electronAPI.onAuthSuccess((event, tok) => {
      setToken(tok);
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    window.electronAPI.githubLogin();
  };

  const signOut = () => {
    window.electronAPI.githubLogout().then(() => setToken(null));
  };

  return { token, signIn, signOut };
}
