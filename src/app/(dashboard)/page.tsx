"use client";

import { useState } from "react";
import { BedDouble, HeartPulse, Zap, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SyncDataButton } from "@/components/sync-data-button";
import { MetricCard } from "@/components/metric-card";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricDetailModal } from "@/components/dashboard/metric-detail-modal";
import { WeeklyReport } from "@/components/dashboard/weekly-report";
import { SleepAnalysisCard } from "@/components/dashboard/sleep-analysis-card";
import { RecentWorkouts } from "@/components/dashboard/recent-workouts";
import { NutritionSummary } from "@/components/dashboard/nutrition-summary";
import { WeightTrendChart } from "@/components/dashboard/weight-trend-chart";

type MetricKey = "sleep_score" | "readiness_score" | "hrv" | "spo2";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { metrics, isLoading } = useData();
  const [modalData, setModalData] = useState<{ title: string; dataKey: MetricKey; unit?: string } | null>(null);

  // API returns newest first. latest is at index 0.
  const latestMetrics = metrics && metrics.length > 0 ? metrics[0] : null;
  const previousMetrics = metrics && metrics.length > 1 ? metrics[1] : null;
  
  // Get the last 7 days and reverse them so the chart shows oldest to newest
  const chartMetrics = metrics.slice(0, 7).reverse();
  
  const welcomeMessage = profile?.first_name ? `Welcome back, ${profile.first_name}!` : "Welcome Back!";

  const handleCardClick = (title: string, dataKey: MetricKey, unit?: string) => setModalData({ title, dataKey, unit });

  const getChange = (current: number | undefined, previous: number | undefined) => {
    if (previous === undefined || previous === 0 || current === undefined) return { change: "vs last", changeType: undefined };
    const diff = current - previous;
    const percentChange = (diff / previous) * 100;
    return {
      change: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(0)}%`,
      changeType: percentChange >= 0 ? "positive" : "negative",
    };
  };

  if (isLoading) return <Skeleton className="h-[800px] w-full" />;

  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-2xl font-bold tracking-tight">You have no health data yet.</h3>
        <p className="text-sm text-muted-foreground">Sync your sample data to get started.</p>
        <SyncDataButton />
      </div>
    );
  }

  const readinessChange = getChange(latestMetrics?.readiness_score, previousMetrics?.readiness_score);
  const sleepChange = getChange(latestMetrics?.sleep_score, previousMetrics?.sleep_score);
  const hrvChange = getChange(latestMetrics?.hrv, previousMetrics?.hrv);
  const spo2Change = getChange(latestMetrics?.spo2, previousMetrics?.spo2);

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-12">
        <div className="col-span-12">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{welcomeMessage}</CardTitle>
                <CardDescription>Here's your comprehensive health analysis for today.</CardDescription>
              </div>
              <SyncDataButton />
            </CardHeader>
          </Card>
        </div>

        <div className="col-span-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Readiness" value={latestMetrics?.readiness_score ?? "N/A"} icon={Zap} unit="%" description="vs yesterday" change={readinessChange.change} changeType={readinessChange.changeType as any} onClick={() => handleCardClick("Readiness", "readiness_score", "%")} />
          <MetricCard title="Sleep Score" value={latestMetrics?.sleep_score ?? "N/A"} icon={BedDouble} description="vs last night" change={sleepChange.change} changeType={sleepChange.changeType as any} onClick={() => handleCardClick("Sleep Score", "sleep_score")} />
          <MetricCard title="HRV" value={latestMetrics?.hrv ?? "N/A"} icon={HeartPulse} unit=" ms" description="vs yesterday" change={hrvChange.change} changeType={hrvChange.changeType as any} onClick={() => handleCardClick("HRV", "hrv", "ms")} />
          <MetricCard title="SpO2" value={latestMetrics?.spo2 ?? "N/A"} icon={Wind} unit="%" description="vs yesterday" change={spo2Change.change} changeType={spo2Change.changeType as any} onClick={() => handleCardClick("SpO2", "spo2", "%")} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <WeeklyReport />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <NutritionSummary />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RecentWorkouts />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <WeightTrendChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SleepAnalysisCard />
        </div>
      </div>
      
      {modalData && (
        <MetricDetailModal isOpen={!!modalData} onOpenChange={() => setModalData(null)} title={modalData.title} dataKey={modalData.dataKey} data={chartMetrics} unit={modalData.unit} />
      )}
    </>
  );
}