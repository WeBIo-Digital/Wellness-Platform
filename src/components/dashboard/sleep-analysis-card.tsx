"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SleepStagesChart } from "@/components/sleep-stages-chart";
import { SleepStageCard } from "./sleep-stage-card";
import { useData } from "@/context/data-context";
import { Waves, Zap, Brain, Bed } from "lucide-react";

const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

export function SleepAnalysisCard() {
    const { metrics } = useData();
    const latestMetrics = metrics && metrics.length > 0 ? metrics[0] : null;

    if (!latestMetrics) {
        return (
            <Card className="col-span-12 lg:col-span-6">
                <CardHeader>
                    <CardTitle>Sleep Analysis</CardTitle>
                    <CardDescription>A breakdown of your most recent sleep stages.</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[350px] items-center justify-center">
                    <p className="text-muted-foreground">No sleep data available.</p>
                </CardContent>
            </Card>
        );
    }

    const { sleep_awake_minutes, sleep_rem_minutes, sleep_light_minutes, sleep_deep_minutes } = latestMetrics;
    const totalSleep = sleep_rem_minutes + sleep_light_minutes + sleep_deep_minutes + sleep_awake_minutes;

    const getPercentage = (minutes: number) => {
        return totalSleep > 0 ? `${((minutes / totalSleep) * 100).toFixed(0)}%` : '0%';
    };

    const sleepStages = [
        { title: "Awake", duration: formatDuration(sleep_awake_minutes), percentage: getPercentage(sleep_awake_minutes), icon: Waves, color: "bg-[hsl(var(--chart-1))]" },
        { title: "REM", duration: formatDuration(sleep_rem_minutes), percentage: getPercentage(sleep_rem_minutes), icon: Brain, color: "bg-[hsl(var(--chart-2))]" },
        { title: "Light", duration: formatDuration(sleep_light_minutes), percentage: getPercentage(sleep_light_minutes), icon: Bed, color: "bg-[hsl(var(--chart-3))]" },
        { title: "Deep", duration: formatDuration(sleep_deep_minutes), percentage: getPercentage(sleep_deep_minutes), icon: Zap, color: "bg-[hsl(var(--chart-4))]" },
    ];

    return (
        <Card className="col-span-12 lg:col-span-6">
            <CardHeader>
                <CardTitle>Sleep Analysis</CardTitle>
                <CardDescription>A breakdown of your most recent sleep stages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <SleepStagesChart data={latestMetrics} />
                <div className="space-y-4">
                    {sleepStages.map(stage => (
                        <SleepStageCard key={stage.title} {...stage} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}