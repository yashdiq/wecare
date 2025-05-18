"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shift } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Calendar, Clock } from "lucide-react";

interface ShiftCardProps {
  shift: Shift;
  className?: string;
}

export function ShiftCard({ shift, className }: ShiftCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Client Visit</CardTitle>
        <CardDescription>Details for your scheduled visit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">Date</h3>
            <p>{formatDate(shift.date)}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">Scheduled Time</h3>
            <p>
              {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {shift.client.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Client</h3>
              <p>{shift.client.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">Location</h3>
            <p className="text-sm">{shift.client.address}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4 text-xs text-muted-foreground">
        Shift ID:{" "}
        {`${shift.caregiver.role}-000${shift.caregiver.id}-000${shift.id}`}
      </CardFooter>
    </Card>
  );
}
