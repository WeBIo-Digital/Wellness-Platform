"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./data-table";
import { WorkoutsDataTable } from "./workouts-data-table";
import { NutritionDataTable } from "./nutrition-data-table";
import { BodyMeasurementsDataTable } from "./body-measurements-data-table";
import { SyncDataButton } from "@/components/sync-data-button";
import { AddMetricForm } from "./add-metric-form";
import { AddWorkoutForm } from "./add-workout-form";
import { AddNutritionLogForm } from "./add-nutrition-log-form";
import { AddBodyMeasurementForm } from "./add-body-measurement-form";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DataPage() {
  const { metrics, workouts, nutritionLogs, bodyMeasurements, isLoading } = useData();

  return (
    <Tabs defaultValue="metrics" className="grid gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="body">Body Measurements</TabsTrigger>
        </TabsList>
        <div className="flex-shrink-0">
            <SyncDataButton />
        </div>
      </div>

      <TabsContent value="metrics">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Daily Health Metrics</CardTitle><CardDescription>View, add, edit, or delete your daily health records.</CardDescription></div>
            <AddMetricForm />
          </CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-64 w-full" /> : <DataTable data={metrics} />}</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="workouts">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Workout Logs</CardTitle><CardDescription>View, add, edit, or delete your workout records.</CardDescription></div>
            <AddWorkoutForm />
          </CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-64 w-full" /> : <WorkoutsDataTable data={workouts} />}</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="nutrition">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Nutrition Logs</CardTitle><CardDescription>View, add, edit, or delete your daily nutrition summaries.</CardDescription></div>
            <AddNutritionLogForm />
          </CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-64 w-full" /> : <NutritionDataTable data={nutritionLogs} />}</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="body">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Body Measurements</CardTitle><CardDescription>View, add, edit, or delete your body measurement records.</CardDescription></div>
            <AddBodyMeasurementForm />
          </CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-64 w-full" /> : <BodyMeasurementsDataTable data={bodyMeasurements} />}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}