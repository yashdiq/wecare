"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPreview } from "@/components/ui/map-preview";
import { formatDate, formatTimestamp } from "@/lib/utils";
import { MOCK_VISIT_HISTORY } from "@/lib/data";
import { Clock, MapPin, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function VisitHistory() {
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);

  const toggleVisit = (shiftId: string) => {
    setExpandedVisit(expandedVisit === shiftId ? null : shiftId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit History</CardTitle>
        <CardDescription>
          Previous visit logs and locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {MOCK_VISIT_HISTORY.map((visit, index) => (
              <motion.div
                key={visit.shiftId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-lg border border-border overflow-hidden"
              >
                <div
                  className="p-4 bg-card cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => toggleVisit(visit.shiftId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {formatDate(new Date(visit.startLog!.timestamp).toISOString().split('T')[0])}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(visit.startLog!.timestamp)} - {formatTimestamp(visit.endLog!.timestamp)}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        expandedVisit === visit.shiftId && "transform rotate-180"
                      )}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedVisit === visit.shiftId && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-border space-y-4">
                        <div className="flex items-start space-x-3">
                          <User className="h-4 w-4 mt-1" />
                          <div>
                            <h4 className="text-sm font-medium">Client</h4>
                            <p className="text-sm text-muted-foreground">{visit.client.name}</p>
                            <p className="text-sm text-muted-foreground">{visit.client.address}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Location</span>
                          </div>
                          <MapPreview
                            location={visit.startLog!.location}
                            label="Visit Location"
                          />
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                          <span>Duration: {Math.round((visit.endLog!.timestamp - visit.startLog!.timestamp) / 60000)} minutes</span>
                          <span className="text-xs">ID: {visit.shiftId}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}