"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Insight } from "@/lib/insights";
import { ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

interface InsightCardProps {
  insight: Insight;
  onClick: () => void;
  onDismiss: () => void;
}

export function InsightCard({ insight, onClick, onDismiss }: InsightCardProps) {
  const { Icon, title, message, color, chartData } = insight;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when dismissing
    onDismiss();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        onClick={chartData ? onClick : undefined}
        className={`relative ${chartData ? "cursor-pointer transition-colors hover:bg-muted/50" : ""}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4 pr-10">
          <div className="flex-shrink-0 pt-1">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="flex-grow">
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
        {chartData && (
          <CardFooter>
            <Button variant="link" className="p-0 h-auto text-sm">
              Analyze Data Trend
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}