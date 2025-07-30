import "../App.css";
import { Button } from "@/components/ui/button";

function Authorization() {
  const base_url = "https://www.strava.com/oauth/authorize";
  const params = {
    client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_STRAVA_REDIRECT_URI,
    response_type: "code",
    approval_prompt: "auto",
    scope: "activity:read_all",
  };
  const url = `${base_url}?${new URLSearchParams(params).toString()}`;

  const handleLogin = () => {
    window.location.href = url;
  };

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold mb-4">Run Tracer</h1>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}

export default Authorization;
