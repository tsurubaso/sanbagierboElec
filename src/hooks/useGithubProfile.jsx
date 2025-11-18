import { useEffect, useState } from "react";
import { useGithubSession } from "./useGithubSession";

export function useGithubProfile() {
  const { tokenPresent } = useGithubSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!tokenPresent) return;

    async function load() {
      const p = await window.electronAPI.githubProfile();
      setProfile(p);
    }

    load();
  }, [tokenPresent]);

  return profile;
}
