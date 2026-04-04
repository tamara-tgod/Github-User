import { useState } from "react";
import type { GitHubUser } from "./types";

function App() {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  // fetch github api
  async function fetchGitHubUser(username: string): Promise<GitHubUser> {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch Github user");
    }

    const user: GitHubUser = await response.json();
    return user;
  }

  // handle username search
  async function handleSearch() {
    setError("")
    try {
      if (userName === "") {
        setError("Please enter a username");
        return;
      }
      setLoading(true);
      const result = await fetchGitHubUser(userName);
      setUser(result);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong")
      }
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input type="text" onChange={(e) => setUserName(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <div>
        {loading && <p>Searching...</p>}
        {user ? (
          <div>
            <img src={user.avatar_url} alt={user.login} />
            <h2>{user.name}</h2>
            <p>{user.login}</p>
            <p>{user.bio}</p>
            <p>Followers: {user.followers}</p>
            <p>Following: {user.following}</p>
            <p>Public Repos: {user.public_repos}</p>
            <a href={user.html_url}>View Profile</a>
          </div>
        ) : (
          error
        )}
      </div>
    </>
  );
}

export default App;
