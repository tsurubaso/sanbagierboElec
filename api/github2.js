// api/github.js
import axios from "axios";


export async function exchangeCodeForToken(code) {
  try {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const res = await axios.post(
      "https://github.com/login/oauth/access_token",
      { client_id, client_secret, code },
      { headers: { Accept: "application/json" } }
    );

    if (!res.data.access_token) {
      throw new Error("GitHub returned no token");
    }

    return res.data.access_token;
  } catch (err) {
    console.error("GitHub token error:", err);
    throw err;
  }
}
