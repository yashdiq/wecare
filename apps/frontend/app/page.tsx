"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShiftCard } from "@/components/shift-card";
import { VisitLogger } from "@/components/visit-logger";
import { StatusBar } from "@/components/status-bar";
import { VisitHistory } from "@/components/visit-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { getShiftDetails } from "@/lib/api";

const MotionHeader = motion.header;
const MotionDiv = motion.div;

export default function Home() {
  const router = useRouter();
  const { user, accessToken, hasHydrated } = useAuth();

  const { data: shift, isLoading } = useQuery({
    queryKey: ["shift"],
    queryFn: getShiftDetails,
    enabled: !!user,
  });

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.push("/login");
    }
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated || isLoading || !shift) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen pb-14 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-md mx-auto py-6 px-4">
        <MotionHeader
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            WeCare
          </h1>
          <p className="text-muted-foreground">Welcome, {user?.email}</p>
        </MotionHeader>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Visit</TabsTrigger>
            <TabsTrigger value="history">Visit History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {shift && <ShiftCard shift={shift} />}
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {shift && <VisitLogger shift={shift} />}
            </MotionDiv>
          </TabsContent>

          <TabsContent value="history">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <VisitHistory />
            </MotionDiv>
          </TabsContent>
        </Tabs>
      </div>

      <StatusBar />
    </main>
  );
}
