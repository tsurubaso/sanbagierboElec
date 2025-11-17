import { useGithubSession } from "../hooks/useGithubSession";

export default function GithubSyncButtons() {
  const { token } = useGithubSession();

  if (!token) return null;

  return (
    <div className="flex gap-2 mt-4">
      <button
        className="px-3 py-2 bg-green-600 text-white rounded"
        onClick={() => window.electronAPI.githubPull()}
      >
        ⬇️ Pull
      </button>

      <button
        className="px-3 py-2 bg-blue-600 text-white rounded"
        onClick={() => window.electronAPI.githubPush()}
      >
        ⬆️ Push
      </button>

      <button
        className="px-3 py-2 bg-yellow-600 text-white rounded"
        onClick={() => window.electronAPI.githubSync()}
      >
        🔄 Sync
      </button>
    </div>
  );
}
