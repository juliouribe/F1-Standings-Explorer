export interface Driver {
  name: string;
  dob: string;
  short_name: string;
}

export interface Constructor {
  name: string;
}

export interface RaceTrack {
  name: string;
  country: string;
}

export interface RaceResult {
  driver: Driver;
  constructor: Constructor;
  start_position: number;
  finish_position: number;
  finish_status: string;
  points: number;
}

export interface GrandPrix {
  id: number;
  name: string;
  round: number;
  date: string;
  race_track: RaceTrack;
  race_results: RaceResult[];
}

export interface DriverSummary {
  [track: string]: number;
  total: number;
}

export interface SummaryResults {
  [driver_name: string]: DriverSummary[];
}

export interface ProcessedData {
  raceLabels: string[];
  raceInfo: Record<string, any>[];
  sortedDrivers: string[];
  drivers: Record<string, string>;
  positionPerRace: Record<string, number[]>;
  cumulativePoints: Record<string, number[]>;
  sortedConstructors: string[];
  constructorPoints: Record<string, number[]>;
}
