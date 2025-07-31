"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useData } from "@/context/data-context";
import { Dumbbell, Bike, PersonStanding, Flame } from "lucide-react";
import { format } from "date-fns";

const workoutIcons: { [key: string]: React.ElementType } = {
  Running: PersonStanding,
  Weightlifting: Dumbbell,
  Cycling: Bike,
  Yoga: PersonStanding,
  Default: Flame,
};

export function RecentWorkouts() {
  const { workouts } = useData();

  if (!workouts || workouts.length === 0) {
    return (
      <Card className="col-span-4 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your latest physical activities.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">No recent workouts logged.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Workouts</CardTitle>
        <CardDescription>Your latest physical activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.slice(0, 3).map((workout) => {
            const Icon = workoutIcons[workout.type] || workoutIcons.Default;
            return (
              <div key={workout.id} className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{workout.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(workout.workout_date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{workout.duration_minutes} min</p>
                  <p className="text-sm text-muted-foreground">
                    {workout.calories_burned} kcal
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}