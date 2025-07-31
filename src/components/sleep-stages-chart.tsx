"use client";

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartProps = {
  data?: {
    sleep_awake_minutes: number;
    sleep_rem_minutes: number;
    sleep_light_minutes: number;
    sleep_deep_minutes: number;
  } | null;
};

export function SleepStagesChart({ data }: ChartProps) {
  if (!data) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
        No sleep data available.
      </div>
    );
  }

  const chartData = [
    { name: "Awake", value: data.sleep_awake_minutes, fill: "hsl(var(--chart-1))" },
    { name: "REM", value: data.sleep_rem_minutes, fill: "hsl(var(--chart-2))" },
    { name: "Light", value: data.sleep_light_minutes, fill: "hsl(var(--chart-3))" },
    { name: "Deep", value: data.sleep_deep_minutes, fill: "hsl(var(--chart-4))" },
  ];

  const totalMinutes = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="relative flex h-[250px] w-full items-center justify-center">
      <ChartContainer
        config={{}}
        className="absolute inset-0"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value) => {
                  if (typeof value === 'number') {
                    const percentage = totalMinutes > 0 ? ((value / totalMinutes) * 100).toFixed(0) : 0;
                    return `${value}m (${percentage}%)`;
                  }
                  return value;
                }}
              />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="80%"
              strokeWidth={2}
              paddingAngle={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} className="focus:outline-none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="absolute flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">Total Sleep</p>
        <p className="text-3xl font-bold">
          {hours}h {minutes}m
        </p>
      </div>
    </div>
  );
}