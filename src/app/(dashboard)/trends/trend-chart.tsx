"use client";

import { format } from "date-fns";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ReferenceLine } from "recharts";
import { Milestone } from "@/context/data-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TrendChartProps<T> {
  title: string;
  description: string;
  data: T[];
  dataKey: keyof T;
  unit?: string;
  name?: string;
  dataKey2?: keyof T;
  unit2?: string;
  name2?: string;
  milestones?: Milestone[];
}

export function TrendChart<T extends { date: string }>({ title, description, data, dataKey, unit = '', name, dataKey2, unit2 = '', name2, milestones = [] }: TrendChartProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}${unit}`}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            {dataKey2 && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}${unit2}`}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
            )}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="line"
                formatter={(value, key) => {
                  if (key === name2) return `${value}${unit2}`;
                  if (key === name) return `${value}${unit}`;
                  return `${value}`;
                }}
              />}
            />
            <Legend />
            <Line
              yAxisId="left"
              dataKey={dataKey as string}
              name={name || (dataKey as string)}
              type="monotone"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            {dataKey2 && (
              <Line
                yAxisId="right"
                dataKey={dataKey2 as string}
                name={name2 || (dataKey2 as string)}
                type="monotone"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />
            )}
            {milestones.map((milestone) => {
              // Check if the milestone date is within the chart's data range
                            const milestoneDate = format(new Date(milestone.milestone_date), 'MMM d');
              if (data.some(d => d.date === milestoneDate)) {
                return (
                  <ReferenceLine 
                    key={milestone.id} 
                    x={milestoneDate} 
                    stroke="hsl(var(--accent-foreground))" 
                    strokeDasharray="2 2"
                  >
                    <Legend content={() => <text x={0} y={10} fill="hsl(var(--accent-foreground))" fontSize="12">{milestone.title}</text>} />
                  </ReferenceLine>
                )
              }
              return null;
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}