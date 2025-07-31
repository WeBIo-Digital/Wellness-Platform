"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useData, BodyMeasurement } from "@/context/data-context";
import { EditBodyMeasurementForm } from "./edit-body-measurement-form";

export function BodyMeasurementsDataTable({ data }: { data: BodyMeasurement[] }) {
  const { deleteBodyMeasurement } = useData();
  const [isPending, startTransition] = useTransition();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState<number | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [measurementToEdit, setMeasurementToEdit] = useState<BodyMeasurement | null>(null);

  const handleDelete = () => {
    if (!measurementToDelete) return;
    startTransition(async () => {
      const result = await deleteBodyMeasurement(measurementToDelete);
      if (result.ok) { toast.success(result.message || "Measurement deleted successfully."); } 
      else { toast.error(result.message || "Failed to delete measurement."); }
      setIsDeleteDialogOpen(false);
      setMeasurementToDelete(null);
    });
  };

  const openDeleteDialog = (id: number) => { setMeasurementToDelete(id); setIsDeleteDialogOpen(true); };
  const openEditDialog = (measurement: BodyMeasurement) => { setMeasurementToEdit(measurement); setIsEditDialogOpen(true); };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Weight (kg)</TableHead>
              <TableHead className="text-right">Body Fat (%)</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{format(new Date(m.measurement_date), "PPP")}</TableCell>
                <TableCell className="text-right">{m.weight_kg}</TableCell>
                <TableCell className="text-right">{m.body_fat_percentage}%</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditDialog(m)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onSelect={() => openDeleteDialog(m.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditBodyMeasurementForm measurement={measurementToEdit} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this measurement.</AlertDialogDescription>
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