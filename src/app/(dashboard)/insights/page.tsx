"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Insight, generateInsights } from "@/lib/insights";
import { InsightDetailModal } from "@/components/insights/insight-detail-modal";
import { InsightCard } from "@/components/insights/insight-card";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";

// Add a unique ID to each insight for state management and animations
type InsightWithId = Insight & { id: string };

type GroupedInsights = {
  [key in Insight['category']]?: InsightWithId[];
};

export default function InsightsPage() {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const { metrics, isLoading } = useData();
  const [visibleInsights, setVisibleInsights] = useState<InsightWithId[]>([]);

  useEffect(() => {
    if (!isLoading && metrics) {
      const initialInsights = generateInsights(metrics).map((insight, index) => ({
        ...insight,
        id: `${insight.title}-${index}` // Create a stable ID
      }));
      setVisibleInsights(initialInsights);
    }
  }, [isLoading, metrics]);

  const groupedInsights = useMemo(() => {
    return visibleInsights.reduce((acc, insight) => {
      const category = insight.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(insight);
      return acc;
    }, {} as GroupedInsights);
  }, [visibleInsights]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const categoryOrder: Insight['category'][] = ['Alert', 'Recommendation', 'Observation', 'Initialization'];
  const categoryTitles: Record<Insight['category'], string> = {
    Alert: "Critical Alerts",
    Recommendation: "AI Recommendations",
    Observation: "Key Observations",
    Initialization: "System Status"
  };

  const handleInsightClick = (insight: Insight) => {
    if (insight.chartData) {
      setSelectedInsight(insight);
    }
  };

  const handleDismissInsight = (insightId: string) => {
    setVisibleInsights(currentInsights =>
      currentInsights.filter(insight => insight.id !== insightId)
    );
  };

  return (
    <>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your AI Health Analyst</CardTitle>
            <CardDescription>
              Our AI has analyzed your recent data trends to provide these actionable, personalized recommendations.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="space-y-8">
          {categoryOrder.map(category => (
            groupedInsights[category] && groupedInsights[category]!.length > 0 && (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">{categoryTitles[category]}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <AnimatePresence>
                    {groupedInsights[category]?.map(insight => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        onClick={() => handleInsightClick(insight)}
                        onDismiss={() => handleDismissInsight(insight.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <InsightDetailModal
        isOpen={!!selectedInsight}
        onOpenChange={() => setSelectedInsight(null)}
        insight={selectedInsight}
      />
    </>
  );
}