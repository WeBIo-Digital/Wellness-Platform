"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useData } from "@/context/data-context";

const MACRO_COLORS = {
  protein: "hsl(var(--chart-1))",
  carbs: "hsl(var(--chart-2))",
  fat: "hsl(var(--chart-3))",
};

export function NutritionSummary() {
  const { nutritionLogs } = useData();

  // Get the latest log (API returns them sorted by date descending)
  const latestNutritionLog = nutritionLogs && nutritionLogs.length > 0 ? nutritionLogs[0] : null;

  if (!latestNutritionLog) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Nutrition Summary</CardTitle>
          <CardDescription>Today's macronutrient intake.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">No nutrition data for today.</p>
        </CardContent>
      </Card>
    );
  }

  const macroData = [
    { name: "Protein", value: latestNutritionLog.protein_grams, fill: MACRO_COLORS.protein },
    { name: "Carbs", value: latestNutritionLog.carbs_grams, fill: MACRO_COLORS.carbs },
    { name: "Fat", value: latestNutritionLog.fat_grams, fill: MACRO_COLORS.fat },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Summary</CardTitle>
        <CardDescription>Today's macronutrient intake.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} dataKey="value" nameKey="name" innerRadius="60%">
                  {macroData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconSize={8}
                  formatter={(value, entry) => (
                    <span className="text-muted-foreground">
                      {value} ({entry.payload?.value}g)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-4xl font-bold">{latestNutritionLog.calories}</p>
            <p className="text-sm text-muted-foreground">Total Calories</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}