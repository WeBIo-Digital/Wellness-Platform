"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TrendSpotlightProps {
  data: { [key: string]: any[] };
  metrics: { value: string; label: string; unit: string }[];
}

const calculateTrend = (data: number[]) => {
  if (data.length < 2) return { change: 0, percentChange: 0 };
  const start = data[0];
  const end = data[data.length - 1];
  if (start === 0) return { change: end - start, percentChange: end > 0 ? 100 : 0 };
  const change = end - start;
  const percentChange = (change / start) * 100;
  return { change, percentChange };
};

export function TrendSpotlight({ data, metrics }: TrendSpotlightProps) {
  const trends = useMemo(() => {
    return metrics
      .map(metric => {
        const metricData = data[metric.value]?.filter(v => v !== null && v !== undefined).map(Number);
        if (!metricData || metricData.length < 2) return null;
        const { percentChange } = calculateTrend(metricData);
        return { ...metric, percentChange };
      })
      .filter(Boolean) as ({ value: string; label: string; unit: string; percentChange: number }[]);
  }, [data, metrics]);

  const mostImproved = useMemo(() => {
    if (trends.length === 0) return null;
    return trends.reduce((max, current) => (current.percentChange > max.percentChange ? current : max), trends[0]);
  }, [trends]);

  const mostDeclined = useMemo(() => {
    if (trends.length === 0) return null;
    return trends.reduce((min, current) => (current.percentChange < min.percentChange ? current : min), trends[0]);
  }, [trends]);

  if (!mostImproved || !mostDeclined) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Improved</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostImproved.label}</div>
          <p className="text-xs text-muted-foreground">
            +{mostImproved.percentChange.toFixed(1)}% this period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Area for Focus</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostDeclined.label}</div>
          <p className="text-xs text-muted-foreground">
            {mostDeclined.percentChange.toFixed(1)}% this period
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
