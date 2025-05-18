"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const AuthHydration = () => {
  const setHasHydrated = useAuth((state) => state.setHasHydrated);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  return null;
};
