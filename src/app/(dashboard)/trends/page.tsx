"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendChart } from "./trend-chart";
import { AddMilestoneDialog } from "./add-milestone-dialog";
import { TrendSpotlight } from './trend-spotlight';

const allMetrics = {
  health: [
    { value: 'readiness_score', label: 'Readiness Score', unit: '%' },
    { value: 'sleep_score', label: 'Sleep Score', unit: '' },
    { value: 'hrv', label: 'HRV', unit: 'ms' },
    { value: 'weight_kg', label: 'Weight', unit: 'kg' },
  ],
  nutrition: [
    { value: 'calories', label: 'Calories', unit: 'kcal' },
    { value: 'protein_grams', label: 'Protein', unit: 'g' },
    { value: 'carbs_grams', label: 'Carbs', unit: 'g' },
    { value: 'fat_grams', label: 'Fat', unit: 'g' },
  ],
  workouts: [
    { value: 'duration_minutes', label: 'Duration', unit: 'min' },
    { value: 'calories_burned', label: 'Calories Burned', unit: 'kcal' },
  ],
};

export default function TrendsPage() {
  const { metrics, bodyMeasurements, nutritionLogs, workouts, isLoading, milestones } = useData();
  const [timeRange, setTimeRange] = useState("30");
  const [category, setCategory] = useState("health");
  const [correlations, setCorrelations] = useState<{ [key: string]: string | null }>({});

  const spotlightMetrics = useMemo(() => {
    return allMetrics[category as keyof typeof allMetrics];
  }, [category]);
  const filteredData = useMemo(() => {
    const range = parseInt(timeRange, 10);
    
    const healthData = metrics
      .slice(0, range)
      .map(m => ({
        date: format(new Date(m.metric_date), "MMM d"),
        readiness_score: m.readiness_score,
        sleep_score: m.sleep_score,
        hrv: m.hrv,
      }))
      .reverse();

    const bodyData = bodyMeasurements
      .slice(0, range)
      .map(m => ({
        date: format(new Date(m.measurement_date), "MMM d"),
        weight_kg: m.weight_kg,
      }))
      .reverse();

    const nutritionData = nutritionLogs
      .slice(0, range)
      .map(log => ({
        date: format(new Date(log.log_date), "MMM d"),
        calories: log.calories,
        protein_grams: log.protein_grams,
        carbs_grams: log.carbs_grams,
        fat_grams: log.fat_grams,
      }))
      .reverse();

    const workoutData = workouts
      .slice(0, range)
      .map(workout => ({
        date: format(new Date(workout.workout_date), "MMM d"),
        duration_minutes: workout.duration_minutes,
        calories_burned: workout.calories_burned,
      }))
      .reverse();

    const combinedHealthData = healthData.map(h => {
      const bodyMetric = bodyData.find(b => b.date === h.date);
      return { ...h, ...(bodyMetric && { weight_kg: bodyMetric.weight_kg }) };
    });

    return { healthData: combinedHealthData, bodyData, nutritionData, workoutData };
  }, [timeRange, metrics, bodyMeasurements, nutritionLogs, workouts]);
  const spotlightData = useMemo(() => {
    const dataKey = `${category}Data` as keyof typeof filteredData;
    const sourceData = filteredData[dataKey] as any[];
    if (!sourceData || sourceData.length === 0) return {};

    const result: { [key: string]: number[] } = {};
    spotlightMetrics.forEach(metric => {
      result[metric.value] = sourceData.map(d => d[metric.value]).filter(v => v != null);
    });

    return result;
  }, [filteredData, category, spotlightMetrics]);

  

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Health & Wellness Trends</CardTitle>
            <CardDescription>
              Analyze your key metrics over time to spot patterns and track your progress.
            </CardDescription>
          </div>
          <AddMilestoneDialog />
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <TrendSpotlight data={spotlightData} metrics={spotlightMetrics} />
      )}
      
      <Tabs defaultValue="health" onValueChange={setCategory}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
            </TabsList>
            
            <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full sm:w-auto flex-shrink-0">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="7">7D</TabsTrigger>
                    <TabsTrigger value="30">30D</TabsTrigger>
                    <TabsTrigger value="90">90D</TabsTrigger>
                    <TabsTrigger value="180">180D</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <TabsContent value="health" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm">
                  <TrendChart 
                    title="Readiness Score" 
                    description={`Your readiness trend for the last ${timeRange} days.`} 
                    data={filteredData.healthData} 
                    dataKey="readiness_score" 
                    name="Readiness" 
                    unit="%" 
                    dataKey2={correlations.readiness_score as keyof typeof filteredData.healthData[0]} 
                    name2={allMetrics.health.find(m => m.value === correlations.readiness_score)?.label}
                    unit2={allMetrics.health.find(m => m.value === correlations.readiness_score)?.unit}
                    milestones={milestones}
                  />
                  <div className="absolute top-4 right-4">
                    <Select onValueChange={(value) => setCorrelations(prev => ({...prev, readiness_score: value === 'none' ? null : value}))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Correlate with..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {allMetrics.health.filter(m => m.value !== 'readiness_score').map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                                                <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm">
                  <TrendChart 
                    title="Sleep Score" 
                    description={`Your sleep score trend for the last ${timeRange} days.`} 
                    data={filteredData.healthData} 
                    dataKey="sleep_score" 
                    name="Sleep" 
                    dataKey2={correlations.sleep_score as keyof typeof filteredData.healthData[0]} 
                    name2={allMetrics.health.find(m => m.value === correlations.sleep_score)?.label}
                    unit2={allMetrics.health.find(m => m.value === correlations.sleep_score)?.unit}
                    milestones={milestones}
                  />
                  <div className="absolute top-4 right-4">
                    <Select onValueChange={(value) => setCorrelations(prev => ({...prev, sleep_score: value === 'none' ? null : value}))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Correlate with..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {allMetrics.health.filter(m => m.value !== 'sleep_score').map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                                                <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm">
                  <TrendChart 
                    title="Heart Rate Variability (HRV)" 
                    description={`Your HRV trend for the last ${timeRange} days.`} 
                    data={filteredData.healthData} 
                    dataKey="hrv" 
                    name="HRV" 
                    unit="ms" 
                    dataKey2={correlations.hrv as keyof typeof filteredData.healthData[0]} 
                    name2={allMetrics.health.find(m => m.value === correlations.hrv)?.label}
                    unit2={allMetrics.health.find(m => m.value === correlations.hrv)?.unit}
                    milestones={milestones}
                  />
                  <div className="absolute top-4 right-4">
                    <Select onValueChange={(value) => setCorrelations(prev => ({...prev, hrv: value === 'none' ? null : value}))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Correlate with..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {allMetrics.health.filter(m => m.value !== 'hrv').map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                                                <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm">
                  <TrendChart 
                    title="Weight" 
                    description={`Your weight trend for the last ${timeRange} days.`} 
                    data={filteredData.healthData} 
                    dataKey="weight_kg" 
                    name="Weight" 
                    unit="kg" 
                    dataKey2={correlations.weight_kg as keyof typeof filteredData.healthData[0]} 
                    name2={allMetrics.health.find(m => m.value === correlations.weight_kg)?.label}
                    unit2={allMetrics.health.find(m => m.value === correlations.weight_kg)?.unit}
                    milestones={milestones}
                  />
                  <div className="absolute top-4 right-4">
                    <Select onValueChange={(value) => setCorrelations(prev => ({...prev, weight_kg: value === 'none' ? null : value}))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Correlate with..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {allMetrics.health.filter(m => m.value !== 'weight_kg').map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="nutrition" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
                                <TrendChart title="Calories" description={`Your calorie intake for the last ${timeRange} days.`} data={filteredData.nutritionData} dataKey="calories" unit=" kcal" milestones={milestones} />
                                <TrendChart title="Protein Intake" description={`Your protein intake for the last ${timeRange} days.`} data={filteredData.nutritionData} dataKey="protein_grams" unit="g" milestones={milestones} />
                                <TrendChart title="Carbohydrate Intake" description={`Your carbohydrate intake for the last ${timeRange} days.`} data={filteredData.nutritionData} dataKey="carbs_grams" unit="g" milestones={milestones} />
                                <TrendChart title="Fat Intake" description={`Your fat intake for the last ${timeRange} days.`} data={filteredData.nutritionData} dataKey="fat_grams" unit="g" milestones={milestones} />
            </div>
        </TabsContent>
        <TabsContent value="workouts" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
                                <TrendChart title="Workout Duration" description={`Your total workout duration for the last ${timeRange} days.`} data={filteredData.workoutData} dataKey="duration_minutes" unit=" min" milestones={milestones} />
                                <TrendChart title="Calories Burned (from workouts)" description={`Your calories burned from workouts for the last ${timeRange} days.`} data={filteredData.workoutData} dataKey="calories_burned" unit=" kcal" milestones={milestones} />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}