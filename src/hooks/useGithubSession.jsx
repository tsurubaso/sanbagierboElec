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

    // Récupérer la session au chargement
    window.electronAPI
      .githubSession()
      .then(setToken)
      .catch((err) => console.error("Erreur session:", err));

    // Écouter les nouveaux tokens
    const unsubscribe = window.electronAPI.onAuthSuccess((event, tok) => {
      setToken(tok);
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    if (!window.electronAPI) {
      console.error("❌ electronAPI n'est pas disponible");
      return;
    }
    window.electronAPI.githubLogin();
  };

  const signOut = () => {
    if (!window.electronAPI) return;
    window.electronAPI.githubLogout().then(() => setToken(null));
  };

  return { token, signIn, signOut };
}
