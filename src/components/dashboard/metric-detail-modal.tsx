"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from 'date-fns';
import { HealthMetric } from "@/context/data-context";

interface MetricDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  dataKey: keyof HealthMetric;
  data: HealthMetric[];
  unit?: string;
}

export function MetricDetailModal({
  isOpen,
  onOpenChange,
  title,
  dataKey,
  data,
  unit = "",
}: MetricDetailModalProps) {
  const chartData = data.map(item => ({
    day: format(new Date(item.metric_date), 'MMM d'),
    value: item[dataKey],
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title} Trend</DialogTitle>
          <DialogDescription>
            Your {title.toLowerCase()} over the last 7 days.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[300px] w-full pt-4">
          <ChartContainer config={{}} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}${unit}`}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  indicator="line"
                  formatter={(value) => `${value}${unit}`}
                />}
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}