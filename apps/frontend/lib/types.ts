export interface LoginResponse {
  status: boolean;
  accessToken: string;
  user: {
    id: number;
    sub: number;
    email: string;
    role: string;
  };
}

export interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  caregiver: {
    id: number;
    name: string;
    role: string;
  };
  client: {
    name: string;
    address: string;
  };
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface Visit {
  shiftId: number;
  type: "START" | "END";
  timestamp: Date;
  latitude: number;
  longitude: number;
}

export interface VisitLog {
  shiftId: number;
  status?: VisitStatus;
  startLog?: {
    timestamp: number;
    location: GeoLocation;
  };
  endLog?: {
    timestamp: number;
    location: GeoLocation;
  };
  client: {
    name: string;
    address: string;
  };
}

export type VisitStatus = "not_started" | "in_progress" | "completed";
