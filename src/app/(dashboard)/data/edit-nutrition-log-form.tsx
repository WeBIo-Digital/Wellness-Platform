"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useData, NutritionLog } from "@/context/data-context";

const formSchema = z.object({
  log_date: z.date({ required_error: "A date is required." }),
  calories: z.coerce.number().min(0),
  protein_grams: z.coerce.number().min(0),
  carbs_grams: z.coerce.number().min(0),
  fat_grams: z.coerce.number().min(0),
});

interface EditNutritionLogFormProps {
  log: NutritionLog | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNutritionLogForm({ log, isOpen, onOpenChange }: EditNutritionLogFormProps) {
  const { updateNutritionLog } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      log_date: log ? parseISO(log.log_date) : new Date(),
      calories: log?.calories ?? 0,
      protein_grams: log?.protein_grams ?? 0,
      carbs_grams: log?.carbs_grams ?? 0,
      fat_grams: log?.fat_grams ?? 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!log) return;
    const toastId = toast.loading("Updating log...");
    try {
      const payload = { ...values, id: log.id, log_date: format(values.log_date, 'yyyy-MM-dd') };
      const result = await updateNutritionLog(payload);

      if (result.ok) {
        toast.success(result.message || "Log updated successfully!", { id: toastId });
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update log.", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Nutrition Log</DialogTitle>
          <DialogDescription>Make changes to your nutrition record.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField control={form.control} name="log_date" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="calories" render={({ field }) => ( <FormItem> <FormLabel>Total Calories</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="protein_grams" render={({ field }) => ( <FormItem> <FormLabel>Protein (g)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="carbs_grams" render={({ field }) => ( <FormItem> <FormLabel>Carbs (g)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="fat_grams" render={({ field }) => ( <FormItem> <FormLabel>Fat (g)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}> {isSubmitting ? "Saving..." : "Save Changes"} </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}