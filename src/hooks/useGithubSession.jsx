import { useEffect, useState } from "react";

export function useGithubSession() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const t = await window.electronAPI.githubSession();
      setToken(t);
      setLoading(false);
    }
    load();

    // écouter auth-success (device flow terminé)
    const unsubscribe = window.electronAPI.onAuthSuccess((_, newToken) => {
      setToken(newToken);
    });

    return () => unsubscribe();
  }, []);

    return {
    token,
    tokenPresent: Boolean(token),
    loading,
  };
}
