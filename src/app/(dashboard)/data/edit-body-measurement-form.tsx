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
import { useData, BodyMeasurement } from "@/context/data-context";

const formSchema = z.object({
  measurement_date: z.date({ required_error: "A date is required." }),
  weight_kg: z.coerce.number().min(0),
  body_fat_percentage: z.coerce.number().min(0).max(100),
});

interface EditBodyMeasurementFormProps {
  measurement: BodyMeasurement | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBodyMeasurementForm({ measurement, isOpen, onOpenChange }: EditBodyMeasurementFormProps) {
  const { updateBodyMeasurement } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      measurement_date: measurement ? parseISO(measurement.measurement_date) : new Date(),
      weight_kg: measurement?.weight_kg ?? 0,
      body_fat_percentage: measurement?.body_fat_percentage ?? 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!measurement) return;
    const toastId = toast.loading("Updating measurement...");
    try {
      const payload = { ...values, id: measurement.id, measurement_date: format(values.measurement_date, 'yyyy-MM-dd') };
      const result = await updateBodyMeasurement(payload);

      if (result.ok) {
        toast.success(result.message || "Measurement updated successfully!", { id: toastId });
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update measurement.", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Body Measurement</DialogTitle>
          <DialogDescription>Make changes to your measurement record.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField control={form.control} name="measurement_date" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> <FormMessage /> </FormItem> )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="weight_kg" render={({ field }) => ( <FormItem> <FormLabel>Weight (kg)</FormLabel> <FormControl> <Input type="number" step="0.1" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="body_fat_percentage" render={({ field }) => ( <FormItem> <FormLabel>Body Fat (%)</FormLabel> <FormControl> <Input type="number" step="0.1" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
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