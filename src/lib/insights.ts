import { Lightbulb, TrendingUp, Zap, TrendingDown, CheckCircle, ShieldAlert, BrainCircuit, Sun, Moon, Droplets } from "lucide-react";
import { format } from "date-fns";

export type HealthMetric = {
  metric_date: string;
  sleep_score: number;
  readiness_score: number;
  hrv: number;
  spo2: number;
};

export type Insight = {
  category: 'Alert' | 'Observation' | 'Recommendation' | 'Initialization';
  title: string;
  message: string;
  Icon: React.ElementType;
  color: string;
  chartData?: { day: string; value: number }[];
  dataKey?: keyof HealthMetric;
  unit?: string;
};

const getAverage = (data: number[]) => {
  if (data.length === 0) return 0;
  return data.reduce((acc, curr) => acc + curr, 0) / data.length;
};

const getStdDev = (data: number[]) => {
    const n = data.length;
    if (n === 0) return 0;
    const mean = getAverage(data);
    return Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

export function generateInsights(metrics: HealthMetric[]): Insight[] {
  const insights: Insight[] = [];
  if (metrics.length < 3) {
    insights.push({
      category: 'Initialization',
      title: "AI Engine Calibrating",
      message: "The AI needs at least 3 days of data for a full analysis. Keep syncing your data for personalized insights.",
      Icon: BrainCircuit,
      color: "text-primary",
    });
    return insights;
  }

  const latest = metrics[0];
  const recentWeek = metrics.slice(0, 7);
  const weeklyAvgHRV = getAverage(recentWeek.map(m => m.hrv));
  const weeklyAvgSleep = getAverage(recentWeek.map(m => m.sleep_score));

  // --- ALERTS (Most Critical) ---

  if (latest.hrv < weeklyAvgHRV * 0.85) {
    insights.push({
      category: 'Alert',
      title: "AI Alert: Low Recovery State",
      message: `Your HRV of ${latest.hrv}ms is critically lower than your weekly average of ${weeklyAvgHRV.toFixed(0)}ms. Your body is under significant strain. Aggressive recovery (e.g., rest, hydration, light activity) is strongly advised.`,
      Icon: TrendingDown,
      color: "text-red-500",
      chartData: recentWeek.map(m => ({ day: format(new Date(m.metric_date), 'eee'), value: m.hrv })).reverse(),
      dataKey: 'hrv',
      unit: 'ms'
    });
  }

  if (latest.spo2 < 95) {
    insights.push({
      category: 'Alert',
      title: "AI Alert: Low Oxygen Saturation",
      message: `Your SpO2 of ${latest.spo2}% is below the optimal range. While this can be a temporary reading, consistent low levels warrant attention. Ensure good ventilation and consider mindful breathing exercises.`,
      Icon: ShieldAlert,
      color: "text-orange-500",
      chartData: recentWeek.map(m => ({ day: format(new Date(m.metric_date), 'eee'), value: m.spo2 })).reverse(),
      dataKey: 'spo2',
      unit: '%'
    });
  }

  // --- RECOMMENDATIONS (Actionable Advice) ---

  if (latest.readiness_score > 90) {
    insights.push({
      category: 'Recommendation',
      title: "AI Recommendation: Capitalize on Peak Readiness",
      message: `Your readiness score of ${latest.readiness_score}% is exceptional. The AI recommends leveraging this peak state for a challenging workout or a mentally demanding task to maximize your gains.`,
      Icon: Zap,
      color: "text-primary",
      chartData: recentWeek.map(m => ({ day: format(new Date(m.metric_date), 'eee'), value: m.readiness_score })).reverse(),
      dataKey: 'readiness_score',
      unit: '%'
    });
  }

  const sleepStdDev = getStdDev(recentWeek.map(m => m.sleep_score));
  if (sleepStdDev > 8) {
      insights.push({
          category: 'Recommendation',
          title: "AI Insight: Improve Sleep Consistency",
          message: `Your sleep scores have varied significantly this week. The AI suggests focusing on a consistent sleep schedule, even on weekends, to better regulate your circadian rhythm and improve overall recovery.`,
          Icon: Moon,
          color: "text-primary",
          chartData: recentWeek.map(m => ({ day: format(new Date(m.metric_date), 'eee'), value: m.sleep_score })).reverse(),
          dataKey: 'sleep_score'
      });
  }

  // --- OBSERVATIONS (Interesting Patterns) ---

  const readinessTrend = latest.readiness_score - metrics[2].readiness_score;
  if (readinessTrend > 10) {
      insights.push({
          category: 'Observation',
          title: "AI Observation: Strong Upward Trend in Readiness",
          message: `Your readiness has improved by ${readinessTrend} points over the last 3 days. This indicates your recent lifestyle choices are having a very positive impact on your recovery.`,
          Icon: TrendingUp,
          color: "text-primary",
          chartData: recentWeek.map(m => ({ day: format(new Date(m.metric_date), 'eee'), value: m.readiness_score })).reverse(),
          dataKey: 'readiness_score',
          unit: '%'
      });
  }

  if (latest.readiness_score > 85 && latest.sleep_score < 75) {
    insights.push({
        category: 'Observation',
        title: "AI Insight: Resilience Under Strain",
        message: `Interestingly, your readiness is high (${latest.readiness_score}%) despite a lower sleep score (${latest.sleep_score}). Your body is showing resilience, but be mindful of potential cognitive fatigue.`,
        Icon: BrainCircuit,
        color: "text-primary",
    });
  }

  // --- GENERAL TIPS (Always show these) ---
  insights.push({
    category: 'Recommendation',
    title: "AI Wellness Tip: Morning Sunlight",
    message: "To help regulate your circadian rhythm, the AI suggests getting 10-15 minutes of direct sunlight exposure shortly after waking up. This can improve sleep quality and daytime energy levels.",
    Icon: Sun,
    color: "text-amber-500",
  });

  insights.push({
    category: 'Recommendation',
    title: "AI Hydration Reminder",
    message: "Proper hydration is key for cognitive function and physical performance. The AI recommends aiming for 2-3 liters of water throughout the day, adjusting for activity level.",
    Icon: Droplets,
    color: "text-cyan-500",
  });

  if (insights.length < 3) {
     insights.push({
      category: 'Observation',
      title: "AI Analysis: All Systems Stable",
      message: "Your key biomarkers are stable and consistent with your recent baseline. The AI has not detected any significant deviations, indicating a well-balanced state. Keep up the great work!",
      Icon: CheckCircle,
      color: "text-primary",
    });
  }

  return insights;
}