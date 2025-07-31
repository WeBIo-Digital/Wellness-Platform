"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SleepStageCardProps {
  title: string;
  duration: string;
  percentage: string;
  icon: LucideIcon;
  color: string;
}

export function SleepStageCard({
  title,
  duration,
  percentage,
  icon: Icon,
  color,
}: SleepStageCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn("rounded-full p-2", color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{duration}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{percentage}</p>
      </div>
    </div>
  );
}