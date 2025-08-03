import type { Activity } from '@/types';

// Constants for Strava API
const STRAVA_API_BASE_URL = "https://www.strava.com/api/v3";
const OAUTH_TOKEN_URL = `${STRAVA_API_BASE_URL}/oauth/token`;
const ACTIVITIES_URL = `${STRAVA_API_BASE_URL}/athlete/activities`;
const ACTIVITIES_PER_PAGE_LIMIT = 100;

// Local Storage Keys
const ACCESS_TOKEN_KEY = "strava_access_token";
const EXPIRES_AT_KEY = "strava_expires_at";

export const fetchAccessToken = async (
  code: string,
  scope: string
): Promise<string | null> => {
  const params = {
    client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
    client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
    code: code,
    scope: scope,
    grant_type: "authorization_code",
  };

  try {
    // Security risk of calling using client_secret from FE
    const response = await fetch(OAUTH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch access token: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.access_token) {
      // Also security risk of storing access token in local storage - will expire in 6 hours
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      localStorage.setItem(EXPIRES_AT_KEY, data.expires_at.toString());
    }
    return data.access_token;
  } catch (error: unknown) {
    console.error("Error fetching access token:", error instanceof Error ? error.message : error);
    return null;
  }
};

export const getActivities = async (accessToken: string): Promise<Activity[]> => {
  const headers = { Authorization: `Bearer ${accessToken}` };
  let allActivities: Activity[] = [];
  let page = 1;

  try {
    while (true) {
      const params = {
        per_page: ACTIVITIES_PER_PAGE_LIMIT.toString(),
        page: page.toString(),
      };
      const response = await fetch(`${ACTIVITIES_URL}?${new URLSearchParams(params).toString()}`, { headers });

      if (response.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(EXPIRES_AT_KEY);
        throw new Error("Unauthorized: Access token expired or invalid.");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Activity[] = await response.json();

      if (data.length === 0) {
        break; // No more activities to fetch
      }

      allActivities = allActivities.concat(data);
      page++;

      if (data.length < ACTIVITIES_PER_PAGE_LIMIT) {
        break; // Fetched less than perPage, so it's the last page
      }
    }
    return allActivities;
  } catch (error: unknown) {
    console.error("Error fetching activities:", error instanceof Error ? error.message : error);
    return [];
  }
};

export const fetchData = async (
  accessCode: string | null,
  scope: string | null,
  setActivities: (activities: Activity[]) => void
) => {
  try {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedExpiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    const isTokenValid = storedToken && storedExpiresAt && (Date.now() / 1000 < parseInt(storedExpiresAt));

    if (isTokenValid) {
      const activities = await getActivities(storedToken as string);
      setActivities(activities);
      return;
    }

    if (accessCode && scope) {
      const accessToken = await fetchAccessToken(accessCode, scope);
      if (accessToken) {
        const activities = await getActivities(accessToken);
        setActivities(activities);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch access token or activities: ${error}`);
    // Optionally clear local storage if an error occurs during initial fetch
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  }
};