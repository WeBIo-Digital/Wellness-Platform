import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative";
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  unit,
  change,
  changeType,
  onClick,
}: MetricCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {value}
          {unit && (
            <span className="text-base font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {change && changeType && (
            <span
              className={cn(
                "text-xs flex items-center",
                changeType === "positive"
                  ? "text-primary"
                  : "text-red-600"
              )}
            >
              {changeType === "positive" ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {change}
            </span>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}