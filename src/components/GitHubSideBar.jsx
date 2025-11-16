import useGithubSession from "@/hooks/useGithubSession";
import axios from "axios";
import { useState, useEffect } from "react";

export default function GithubSidebar() {
  const { token, signIn, signOut } = useGithubSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        console.log("✅ Profil GitHub chargé:", res.data);
      })
      .catch((err) => console.error("❌ Erreur profil:", err))
      .finally(() => setLoading(false));
  }, [token]);

 if (!token) {
    return (
      <div className="p-4 space-y-4">
        <p className="text-gray-600">Vous n'êtes pas connecté à GitHub.</p>
        <button
          onClick={signIn}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔑 Se connecter avec GitHub
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Chargement du profil...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
        )}
        <div>
          <p className="font-bold">{profile?.name || profile?.login}</p>
          <p className="text-sm text-gray-500">@{profile?.login}</p>
        </div>
      </div>
      
      <button
        onClick={signOut}
        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        🚪 Déconnexion
      </button>
    </div>
  );
}
