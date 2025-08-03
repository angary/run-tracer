import Authorization from "./components/Authorization";
import Map from "./components/Map";
import "./App.css";
import LoadingSpinner from "./components/ui/loading-spinner";



import { useStravaAuth, useStravaActivities } from "./api/strava";

export function App() {
  const { accessToken, isTokenLoading, clearStoredAccessToken } = useStravaAuth();
  const { data: activities, isLoading: isActivitiesLoading, isError: isActivitiesError, error: activitiesError } = useStravaActivities(accessToken ?? null);

  // Handle activities fetch error (e.g., token expired)
  if (isActivitiesError && activitiesError) {
    console.error("Error fetching activities:", activitiesError);
    clearStoredAccessToken();
  }

  const isLoading = isTokenLoading || isActivitiesLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isActivitiesError || !activities || activities.length === 0) {
    return <Authorization />;
  }

  return <Map allActivities={activities} />;
}