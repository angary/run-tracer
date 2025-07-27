import type { Activity } from '@/types';

export const fetchAccessToken = async (
  code: string,
  scope: string
): Promise<string | null> => {
  const url = "https://www.strava.com/api/v3/oauth/token";
  const params = {
    client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
    client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
    response_type: "code",
    code: code,
    scope: scope,
  };
  try {
    // Security risk of calling using client_secret from FE
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

export const getActivities = async (accessToken: string): Promise<Activity[]> => {
  const url = "https://www.strava.com/api/v3/athlete/activities";
  const headers = { Authorization: `Bearer ${accessToken}` };
  const params = {
    per_page: "100",
  };

  try {
    const response = await fetch(url + "?" + new URLSearchParams(params).toString(), { headers });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(
      "Error fetching activities:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const fetchData = async (
  accessCode: string,
  scope: string,
  setActivities: (activities: Activity[]) => void
) => {
  try {
    const accessToken = await fetchAccessToken(accessCode, scope);
    if (accessToken) {
      const activities = await getActivities(accessToken);
      setActivities(activities);
    }
  } catch (error) {
    console.error(`Failed to fetch access token or activities: ${error}`);
  }
};
