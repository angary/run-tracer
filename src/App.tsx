import Authorization from "./components/Authorization";
import MapComponent from "./components/map/MapComponent";
import "./App.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "./components/ui/loading-spinner";

import type { Activity } from "@/types";
import { fetchData } from "@/api";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [scope, setScope] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const newCode = queryParams.get("code");
    const newScope = queryParams.get("scope");

    setCode(newCode);
    setScope(newScope);

    if (newCode && newScope && activities.length === 0) {
      setIsLoading(true);
      fetchData(newCode, newScope, setActivities).finally(() => {
        setIsLoading(false);
      });
    }
  }, [activities]);

  return (
    <>
      {isLoading && code && scope ? (
        <LoadingSpinner />
      ) : activities.length > 0 ? (
        <MapComponent allActivities={activities} />
      ) : (
        <Authorization />
      )}
    </>
  );
}

export default App;
