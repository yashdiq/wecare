"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { GeoLocation } from "@/lib/types";
import { formatCoordinates, getMapUrl } from "@/lib/location";
import { Button } from "@/components/ui/button";

interface MapPreviewProps {
  location: GeoLocation;
  label: string;
}

export function MapPreview({ location, label }: MapPreviewProps) {
  if (!location) return null;

  const { latitude, longitude, accuracy } = location;
  const coordinatesText = formatCoordinates(latitude, longitude);
  const mapUrl = getMapUrl(latitude, longitude);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
          <p className="text-sm">{coordinatesText}</p>
          <p className="text-xs text-muted-foreground">
            Accuracy: ±{Math.round(accuracy ?? 0)}m
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-xs"
            onClick={() => window.open(mapUrl, "_blank")}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
