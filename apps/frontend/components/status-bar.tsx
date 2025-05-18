"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, Clock } from "lucide-react";

export function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 flex justify-between items-center z-10">
      <div className="flex items-center">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500 mr-1.5" />
        ) : (
          <WifiOff className="h-4 w-4 text-destructive mr-1.5" />
        )}
        <span className="text-xs">
          {isOnline ? 'Online' : 'Offline - Data will sync when connection is restored'}
        </span>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1.5" />
        <span className="text-xs">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}