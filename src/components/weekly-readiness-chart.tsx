"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { format } from 'date-fns';

type ChartProps = {
  data: {
    metric_date: string;
    readiness_score: number;
  }[];
};

export function WeeklyReadinessChart({ data = [] }: ChartProps) {
  const chartData = data.map(item => ({
    day: format(new Date(item.metric_date), 'eee'), // Format date to 'Mon', 'Tue', etc.
    score: item.readiness_score,
  }));

  return (
    <ChartContainer config={{}} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="score" fill="hsl(var(--primary))" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}