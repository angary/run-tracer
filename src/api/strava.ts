import type { Activity } from '@/types';
import { useQuery } from "@tanstack/react-query";

// Constants for Strava API
const STRAVA_API_BASE_URL = "https://www.strava.com/api/v3";
const OAUTH_TOKEN_URL = `${STRAVA_API_BASE_URL}/oauth/token`;
const ACTIVITIES_URL = `${STRAVA_API_BASE_URL}/athlete/activities`;
const ACTIVITIES_PER_PAGE_LIMIT = 100;

// Local Storage Keys
const ACCESS_TOKEN_KEY = "strava_access_token";
const EXPIRES_AT_KEY = "strava_expires_at";

const getStoredAccessToken = (): string | null => {
  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const storedExpiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  if (storedToken && storedExpiresAt && Date.now() / 1000 < parseInt(storedExpiresAt)) {
    return storedToken;
  }
  return null;
};

const setStoredAccessToken = (token: string, expiresAt: number) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
};

const clearStoredAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
};

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
      setStoredAccessToken(data.access_token, data.expires_at);
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
        clearStoredAccessToken(); // Clear token on 401
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

export const useStravaAuth = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get("code");
  const scope = queryParams.get("scope");

  const { data: accessToken, isLoading: isTokenLoading } = useQuery({
    queryKey: ["stravaAccessToken", code, scope],
    queryFn: async () => {
      const storedToken = getStoredAccessToken();
      if (storedToken) {
        return storedToken;
      }

      if (code && scope) {
        const token = await fetchAccessToken(code, scope);
        if (token) {
          // Clear URL parameters after successful token fetch
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        return token;
      }
      return null;
    },
    staleTime: Infinity, // Access token doesn't change often
  });

  return { accessToken, isTokenLoading, clearStoredAccessToken };
};

export const useStravaActivities = (accessToken: string | null) => {
  return useQuery<Activity[]>(
    {
      queryKey: ["stravaActivities", accessToken],
      queryFn: () => getActivities(accessToken as string),
      enabled: !!accessToken, // Only run if accessToken is available
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    }
  );
};

