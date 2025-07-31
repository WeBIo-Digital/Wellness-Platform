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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Insight } from "@/lib/insights";

interface InsightDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  insight: Insight | null;
}

export function InsightDetailModal({
  isOpen,
  onOpenChange,
  insight,
}: InsightDetailModalProps) {
  if (!insight || !insight.chartData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{insight.title}</DialogTitle>
          <DialogDescription>{insight.message}</DialogDescription>
        </DialogHeader>
        <div className="h-[250px] w-full pt-4">
          <ChartContainer config={{}} className="h-full w-full">
            <BarChart accessibilityLayer data={insight.chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  formatter={(value) => `${value}${insight.unit || ''}`}
                />}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}