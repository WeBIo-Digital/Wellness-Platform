"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WeeklyReadinessChart } from "@/components/weekly-readiness-chart";
import { useData } from "@/context/data-context";
import { format } from "date-fns";
import { Trophy, Target, TrendingUp, TrendingDown } from "lucide-react";

export function WeeklyReport() {
  const { metrics } = useData();

  if (!metrics || metrics.length < 7) {
    return (
      <Card className="col-span-12 lg:col-span-4">
        <CardHeader>
          <CardTitle>Weekly Report</CardTitle>
          <CardDescription>Your 7-day performance summary.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-center text-muted-foreground">
            Not enough data for a weekly report yet. Keep syncing your data!
          </p>
        </CardContent>
      </Card>
    );
  }

  const weeklyMetrics = metrics.slice(0, 7);
  
  const bestReadinessDay = weeklyMetrics.reduce((prev, current) => 
    (prev.readiness_score > current.readiness_score) ? prev : current
  );

  const worstSleepDay = weeklyMetrics.reduce((prev, current) => 
    (prev.sleep_score < current.sleep_score) ? prev : current
  );

  const readinessTrend = weeklyMetrics[0].readiness_score - weeklyMetrics[6].readiness_score;
  const TrendIcon = readinessTrend >= 0 ? TrendingUp : TrendingDown;
  const trendColor = readinessTrend >= 0 ? "text-primary" : "text-red-500";

  return (
    <Card className="col-span-12 lg:col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Weekly Report</CardTitle>
                <CardDescription>Your 7-day performance summary.</CardDescription>
            </div>
            <div className="flex items-center gap-1">
                <span className={`text-sm font-bold ${trendColor}`}>{readinessTrend >= 0 ? '+' : ''}{readinessTrend}%</span>
                <TrendIcon className={`h-5 w-5 ${trendColor}`} />
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <WeeklyReadinessChart data={weeklyMetrics.slice().reverse()} />
        <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
            <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 flex-shrink-0 text-amber-500 mt-1" />
                <div>
                    <p className="font-semibold">Weekly Win</p>
                    <p className="text-sm text-muted-foreground">
                        Peak readiness of <span className="font-bold text-primary">{bestReadinessDay.readiness_score}%</span> on {format(new Date(bestReadinessDay.metric_date), 'eeee')}.
                    </p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <Target className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                <div>
                    <p className="font-semibold">Focus Area</p>
                    <p className="text-sm text-muted-foreground">
                        Lowest sleep score of <span className="font-bold text-red-500">{worstSleepDay.sleep_score}</span> on {format(new Date(worstSleepDay.metric_date), 'eeee')}.
                    </p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}