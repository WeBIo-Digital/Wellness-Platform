"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useData, HealthMetric } from "@/context/data-context";
import { EditMetricForm } from "./edit-metric-form";

export function DataTable({ data }: { data: HealthMetric[] }) {
  const { deleteMetric } = useData();
  const [isPending, startTransition] = useTransition();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [metricToDelete, setMetricToDelete] = useState<number | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [metricToEdit, setMetricToEdit] = useState<HealthMetric | null>(null);

  const handleDelete = () => {
    if (!metricToDelete) return;
    startTransition(async () => {
      const result = await deleteMetric(metricToDelete);
      if (result.ok) {
        toast.success(result.message || "Metric deleted successfully.");
      } else {
        toast.error(result.message || "Failed to delete metric.");
      }
      setIsDeleteDialogOpen(false);
      setMetricToDelete(null);
    });
  };

  const openDeleteDialog = (metricId: number) => {
    setMetricToDelete(metricId);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (metric: HealthMetric) => {
    setMetricToEdit(metric);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Sleep Score</TableHead>
              <TableHead className="text-right">Readiness</TableHead>
              <TableHead className="text-right">HRV</TableHead>
              <TableHead className="text-right">SpO2</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell className="font-medium">
                  {format(new Date(metric.metric_date), "PPP")}
                </TableCell>
                <TableCell className="text-right">{metric.sleep_score}</TableCell>
                <TableCell className="text-right">{metric.readiness_score}%</TableCell>
                <TableCell className="text-right">{metric.hrv} ms</TableCell>
                <TableCell className="text-right">{metric.spo2}%</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditDialog(metric)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={() => openDeleteDialog(metric.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <EditMetricForm 
        metric={metricToEdit}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              health metric record from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              <span className="flex items-center justify-center">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}