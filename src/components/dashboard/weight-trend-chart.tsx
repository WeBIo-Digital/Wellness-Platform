"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useData } from "@/context/data-context";
import { format } from "date-fns";

export function WeightTrendChart() {
  const { bodyMeasurements } = useData();

  if (!bodyMeasurements || bodyMeasurements.length === 0) {
    return null; // Don't render the card if there's no data
  }

  const chartData = bodyMeasurements.map(m => ({
    date: format(new Date(m.measurement_date), "MMM d"),
    weight: m.weight_kg,
  })).reverse(); // reverse to show oldest to newest

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Trend</CardTitle>
        <CardDescription>Your weight over the last 14 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip content={<ChartTooltipContent formatter={(value) => `${value} kg`} />} />
            <Line dataKey="weight" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}