export interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date: string;
  map: ActivityMap;
}

export interface ActivityMap {
  summary_polyline: string;
  polyline?: string;
}
