"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useData, Workout } from "@/context/data-context";
import { EditWorkoutForm } from "./edit-workout-form";

export function WorkoutsDataTable({ data }: { data: Workout[] }) {
  const { deleteWorkout } = useData();
  const [isPending, startTransition] = useTransition();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<number | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);

  const handleDelete = () => {
    if (!workoutToDelete) return;
    startTransition(async () => {
      const result = await deleteWorkout(workoutToDelete);
      if (result.ok) {
        toast.success(result.message || "Workout deleted successfully.");
      } else {
        toast.error(result.message || "Failed to delete workout.");
      }
      setIsDeleteDialogOpen(false);
      setWorkoutToDelete(null);
    });
  };

  const openDeleteDialog = (workoutId: number) => {
    setWorkoutToDelete(workoutId);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (workout: Workout) => {
    setWorkoutToEdit(workout);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Avg HR</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell className="font-medium">{format(new Date(workout.workout_date), "PPP")}</TableCell>
                <TableCell>{workout.type}</TableCell>
                <TableCell className="text-right">{workout.duration_minutes} min</TableCell>
                <TableCell className="text-right">{workout.calories_burned} kcal</TableCell>
                <TableCell className="text-right">{workout.avg_heart_rate} bpm</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditDialog(workout)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onSelect={() => openDeleteDialog(workout.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditWorkoutForm workout={workoutToEdit} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this workout record.</AlertDialogDescription>
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