// api/github.js
import "dotenv/config"; // obligatoire ici aussi si tu veux que process.env soit dispo

export async function exchangeCodeForToken(code) {
  try {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      throw new Error("Missing GitHub OAuth credentials (CLIENT_ID / CLIENT_SECRET)");
    }

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ client_id, client_secret, code })
      }
    );

    if (!response.ok) {
      throw new Error("GitHub OAuth HTTP error " + response.status);
    }

    const data = await response.json();

    if (!data.access_token) {
      console.error("[GitHub OAuth] Bad response:", data);
      throw new Error("GitHub returned no access_token");
    }

    return data.access_token;

  } catch (err) {
    console.error("[GitHub OAuth ERROR]", err);
    throw err;
  }
}
