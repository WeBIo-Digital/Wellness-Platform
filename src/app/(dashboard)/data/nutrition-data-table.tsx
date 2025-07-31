"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useData, NutritionLog } from "@/context/data-context";
import { EditNutritionLogForm } from "./edit-nutrition-log-form";

export function NutritionDataTable({ data }: { data: NutritionLog[] }) {
  const { deleteNutritionLog } = useData();
  const [isPending, startTransition] = useTransition();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<number | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<NutritionLog | null>(null);

  const handleDelete = () => {
    if (!logToDelete) return;
    startTransition(async () => {
      const result = await deleteNutritionLog(logToDelete);
      if (result.ok) { toast.success(result.message || "Log deleted successfully."); } 
      else { toast.error(result.message || "Failed to delete log."); }
      setIsDeleteDialogOpen(false);
      setLogToDelete(null);
    });
  };

  const openDeleteDialog = (id: number) => { setLogToDelete(id); setIsDeleteDialogOpen(true); };
  const openEditDialog = (log: NutritionLog) => { setLogToEdit(log); setIsEditDialogOpen(true); };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Protein (g)</TableHead>
              <TableHead className="text-right">Carbs (g)</TableHead>
              <TableHead className="text-right">Fat (g)</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{format(new Date(log.log_date), "PPP")}</TableCell>
                <TableCell className="text-right">{log.calories}</TableCell>
                <TableCell className="text-right">{log.protein_grams}</TableCell>
                <TableCell className="text-right">{log.carbs_grams}</TableCell>
                <TableCell className="text-right">{log.fat_grams}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditDialog(log)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onSelect={() => openDeleteDialog(log.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditNutritionLogForm log={logToEdit} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this nutrition log.</AlertDialogDescription>
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