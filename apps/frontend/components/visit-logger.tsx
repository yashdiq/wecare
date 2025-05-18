"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle2 } from "lucide-react";
import { GeoLocation, Shift, Visit, VisitLog, VisitStatus } from "@/lib/types";
import { getCurrentLocation } from "@/lib/location";
import { formatTimestamp, isWithinTimeWindow } from "@/lib/utils";
import { MapPreview } from "@/components/ui/map-preview";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { logVisit } from "@/lib/api";

interface VisitLoggerProps {
  shift: Shift;
  className?: string;
}

export function VisitLogger({ shift, className }: VisitLoggerProps) {
  const { toast } = useToast();
  const [watchId, setWatchId] = useState<number>();
  const [visitLog, setVisitLog] = useState<VisitLog>(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("visitLog") : null;
    return saved
      ? JSON.parse(saved, (key, value) => {
          if (key.endsWith("timestamp")) return new Date(value);
          return value;
        })
      : {
          shiftId: shift.id,
          status: "not_started",
          client: {
            name: shift.client.name,
            address: shift.client.address,
          },
        };
  });

  useEffect(() => {
    localStorage.setItem("visitLog", JSON.stringify(visitLog));
  }, [visitLog]);

  useEffect(() => {
    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const visitMutation = useMutation({
    mutationFn: async (visitData: Visit) => {
      return logVisit(visitData);
    },
    onSuccess: (_, variables) => {
      const timeStatus = isWithinTimeWindow(
        variables.timestamp,
        shift.startTime,
        shift.endTime,
        shift.date
      );

      const action = variables.type === "START" ? "started" : "ended";
      let toastMessage = `Visit ${action} successfully!`;
      let toastVariant: "default" | "destructive" = "default";

      if (timeStatus === "early") {
        toastMessage = `Visit ${action} early. Please note this in your report.`;
        toastVariant = "destructive";
      } else if (timeStatus === "late") {
        toastMessage = `Visit ${action} late. Please note this in your report.`;
        toastVariant = "destructive";
      }

      if (variables.type === "END") {
        setVisitLog((prev) => ({
          ...prev,
          status: "completed",
          endLog: {
            timestamp: Date.now(),
            location: {
              latitude: variables.latitude,
              longitude: variables.longitude,
              accuracy: 0,
              timestamp: Date.now(),
            },
          },
        }));

        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
          setWatchId(undefined);
        }
        localStorage.removeItem("visitLog");
      }

      toast({
        title: timeStatus === "on_time" ? "Success!" : "Attention Required",
        description: toastMessage,
        variant: toastVariant,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
          };

          setVisitLog((prev) => ({
            ...prev,
            startLog: prev.startLog
              ? {
                  ...prev.startLog,
                  location: newLocation,
                }
              : undefined,
          }));
        },
        (error) => {
          toast({
            title: "Location Error",
            description: error.message,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      setWatchId(id);
    }
  };

  const handleStartVisit = async () => {
    try {
      const location = await getCurrentLocation();
      const geoLocation: GeoLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: Date.now(),
      };

      const visitData: Visit = {
        shiftId: shift.id,
        type: "START",
        timestamp: new Date(),
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      };

      setVisitLog({
        shiftId: shift.id,
        status: "in_progress",
        startLog: {
          timestamp: Date.now(),
          location: geoLocation,
        },
        client: {
          name: shift.client.name,
          address: shift.client.address,
        },
      });

      startLocationTracking();
      visitMutation.mutate(visitData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleEndVisit = async () => {
    try {
      const location = await getCurrentLocation();
      const geoLocation: GeoLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: Date.now(),
      };

      const visitData: Visit = {
        shiftId: shift.id,
        type: "END",
        timestamp: new Date(),
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      };

      setVisitLog((prev) => ({
        ...prev,
        endLog: {
          timestamp: Date.now(),
          location: geoLocation,
        },
      }));

      visitMutation.mutate(visitData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const renderStatusBadge = () => {
    switch (visitLog.status) {
      case "not_started":
        return (
          <div className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
            Not started
          </div>
        );
      case "in_progress":
        return (
          <div className="inline-flex items-center rounded-full border border-blue-200 px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            In progress
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Visit Log</CardTitle>
          {renderStatusBadge()}
        </div>
        <CardDescription>Record your visit start and end times</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {visitLog.status === "not_started" && (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="w-full h-16 text-lg font-medium animate-pulse"
              onClick={handleStartVisit}
              disabled={visitMutation.isPending}
            >
              <Clock className="mr-2 h-5 w-5" />
              {visitMutation.isPending ? "Starting..." : "Start Visit"}
            </Button>
          </div>
        )}

        {visitLog.status === "in_progress" && (
          <>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Visit Started</h3>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formatTimestamp(visitLog.startLog!.timestamp)}</span>
              </div>
              <MapPreview
                location={visitLog.startLog!.location}
                label="Start Location"
              />
            </div>

            <div className="flex justify-center mt-6">
              <Button
                size="lg"
                variant="default"
                className="w-full h-16 text-lg font-medium"
                onClick={handleEndVisit}
                disabled={visitMutation.isPending}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {visitMutation.isPending ? "Ending..." : "End Visit"}
              </Button>
            </div>
          </>
        )}

        {visitLog.status === "completed" && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Visit Started</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{formatTimestamp(visitLog.startLog!.timestamp)}</span>
                </div>
                <MapPreview
                  location={visitLog.startLog!.location}
                  label="Start Location"
                />
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium">Visit Ended</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{formatTimestamp(visitLog.endLog!.timestamp)}</span>
                </div>
                <MapPreview
                  location={visitLog.endLog!.location}
                  label="End Location"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium">Visit Summary</h3>
                <p className="text-sm">
                  Duration:{" "}
                  {Math.round(
                    (visitLog.endLog!.timestamp -
                      visitLog.startLog!.timestamp) /
                      60000
                  )}{" "}
                  minutes
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
