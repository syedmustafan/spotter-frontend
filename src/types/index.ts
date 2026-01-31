export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Stop {
  id: number;
  type: 'start' | 'pickup' | 'dropoff' | 'fuel' | 'break' | 'rest' | 'pre_trip' | 'end';
  location: string;
  coordinates: Coordinates;
  arrival_time: string;
  departure_time: string;
  duration_minutes: number;
  cumulative_miles: number;
  cumulative_driving_hours: number;
  day: number;
  duty_status: 'on_duty' | 'off_duty' | 'driving' | 'sleeper';
  notes: string;
}

export interface DutySegment {
  status: 'off_duty' | 'sleeper' | 'driving' | 'on_duty';
  start_hour: number;
  end_hour: number;
  location: string;
  notes: string;
}

export interface LogSheetTotals {
  off_duty: number;
  sleeper: number;
  driving: number;
  on_duty: number;
}

export interface LogRemark {
  time: string;
  location: string;
  activity: string;
}

export interface LogSheet {
  date: string;
  day_number: number;
  total_miles: number;
  segments: DutySegment[];
  totals: LogSheetTotals;
  remarks: LogRemark[];
}

export interface TripSummary {
  total_distance_miles: number;
  total_duration_hours: number;
  total_days: number;
  fuel_stops: number;
  rest_breaks: number;
  rest_stops: number;
  cycle_hours_after: number;
}

export interface TripResponse {
  route_geometry: [number, number][];
  stops: Stop[];
  log_sheets: LogSheet[];
  summary: TripSummary;
}

export interface TripInput {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_hours: number;
}
