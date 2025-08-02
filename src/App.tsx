import Authorization from "./components/Authorization";
import Map from "./components/Map";
import "./App.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "./components/ui/loading-spinner";

import type { Activity } from "@/types";
import { fetchData } from "@/api";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    const scope = queryParams.get("scope");

    fetchData(code, scope, setActivities).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : activities.length > 0 ? (
        <Map allActivities={activities} />
      ) : (
        <Authorization />
      )}
    </>
  );
}

export default App;