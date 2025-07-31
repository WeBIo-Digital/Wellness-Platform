"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useData } from "@/context/data-context";

const formSchema = z.object({
  measurement_date: z.date({ required_error: "A date is required." }),
  weight_kg: z.coerce.number().min(0),
  body_fat_percentage: z.coerce.number().min(0).max(100),
});

export function AddBodyMeasurementForm() {
  const { addBodyMeasurement } = useData();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { measurement_date: new Date(), weight_kg: 75.0, body_fat_percentage: 15.0 },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Adding new measurement...");
    try {
      const payload = { ...values, measurement_date: format(values.measurement_date, 'yyyy-MM-dd') };
      const result = await addBodyMeasurement(payload);

      if (result.ok) {
        toast.success(result.message || "Measurement added successfully!", { id: toastId });
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to add measurement.", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Measurement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Body Measurement</DialogTitle>
              <DialogDescription>Manually enter a new body measurement record.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField control={form.control} name="measurement_date" render={({ field }) => ( 
                <FormItem className="flex flex-col"> 
                  <FormLabel>Date</FormLabel> 
                  <Popover> 
                    <PopoverTrigger asChild> 
                      <FormControl> 
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> 
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} 
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> 
                        </Button> 
                      </FormControl> 
                    </PopoverTrigger> 
                    <PopoverContent className="w-auto p-0" align="start"> 
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> 
                    </PopoverContent> 
                  </Popover> 
                  <FormMessage /> 
                </FormItem> 
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="weight_kg" render={({ field }) => ( 
                  <FormItem> 
                    <FormLabel>Weight (kg)</FormLabel> 
                    <FormControl> 
                      <Input type="number" step="0.1" {...field} /> 
                    </FormControl> 
                    <FormMessage /> 
                  </FormItem> 
                )} />
                <FormField control={form.control} name="body_fat_percentage" render={({ field }) => ( 
                  <FormItem> 
                    <FormLabel>Body Fat (%)</FormLabel> 
                    <FormControl> 
                      <Input type="number" step="0.1" {...field} /> 
                    </FormControl> 
                    <FormMessage /> 
                  </FormItem> 
                )} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}> 
                {isSubmitting ? "Saving..." : "Save Measurement"} 
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}