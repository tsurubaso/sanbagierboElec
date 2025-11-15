import useGithubSession from "@/hooks/useGithubSession";
import axios from "axios";
import { useState, useEffect } from "react";

export default function GithubSidebar() {
  const { token, signIn, signOut } = useGithubSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data));
  }, [token]);

  if (!token) {
    return (
      <div>
        <p>Vous n'êtes pas connecté.</p>
        <button onClick={signIn}>🔑 Se connecter avec GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <img src={profile?.avatar_url} className="w-12 h-12 rounded-full" />
      <p>Bonjour {profile?.name} 👋</p>
      <button onClick={signOut}>🚪 Déconnexion</button>
    </div>
  );
}
