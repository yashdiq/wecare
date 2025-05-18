import { GeoLocation } from "./types";

export const getCurrentLocation = (): Promise<GeoLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(
          new Error(
            `Failed to get location: ${error.message} (Code: ${error.code}). Refresh the page to try again.`
          )
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const formatCoordinates = (
  latitude: number,
  longitude: number
): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

export const getMapUrl = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};
