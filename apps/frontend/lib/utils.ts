import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { VisitLog, VisitStatus } from "./types";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatTime(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "h:mm a");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
}

export function getVisitStatus(visitLog: VisitLog | null): VisitStatus {
  if (!visitLog || !visitLog.startLog) return "not_started";
  if (visitLog.startLog && !visitLog.endLog) return "in_progress";
  return "completed";
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function isWithinTimeWindow(
  currentTime: Date,
  startTime: string,
  endTime: string,
  dateString: string
): "early" | "on_time" | "late" {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const shiftStartTime = new Date(dateString);
  shiftStartTime.setHours(startHour, startMinute, 0);

  const shiftEndTime = new Date(dateString);
  shiftEndTime.setHours(endHour, endMinute, 0);

  if (currentTime < shiftStartTime) return "early";
  if (currentTime > shiftEndTime) return "late";
  return "on_time";
}
