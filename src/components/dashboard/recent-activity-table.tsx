"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HealthMetric } from "@/context/data-context";
import { format } from "date-fns";

interface RecentActivityTableProps {
  data: HealthMetric[];
}

export function RecentActivityTable({ data }: RecentActivityTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Readiness</TableHead>
          <TableHead className="text-right">Sleep</TableHead>
          <TableHead className="text-right">HRV</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((metric) => (
          <TableRow key={metric.id}>
            <TableCell className="font-medium">
              {format(new Date(metric.metric_date), "MMM d")}
            </TableCell>
            <TableCell className="text-right">{metric.readiness_score}%</TableCell>
            <TableCell className="text-right">{metric.sleep_score}</TableCell>
            <TableCell className="text-right">{metric.hrv}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}