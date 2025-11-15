import { useState, useEffect } from "react";

export default function useGithubSession() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    window.electronAPI.githubSession().then(setToken);

    window.electronAPI.onAuthSuccess((event, tok) => {
      setToken(tok);
    });
  }, []);

  const signIn = () => {
    window.electronAPI.githubLogin();
  };

  const signOut = () => {
    window.electronAPI.githubLogout().then(() => setToken(null));
  };

  return { token, signIn, signOut };
}
