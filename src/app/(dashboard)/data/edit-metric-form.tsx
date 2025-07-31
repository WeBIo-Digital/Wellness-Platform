"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useData, HealthMetric } from "@/context/data-context";

const formSchema = z.object({
  metric_date: z.date({ required_error: "A date is required." }),
  sleep_score: z.coerce.number().min(0).max(100),
  readiness_score: z.coerce.number().min(0).max(100),
  hrv: z.coerce.number().min(0),
  spo2: z.coerce.number().min(0).max(100),
});

interface EditMetricFormProps {
  metric: HealthMetric | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMetricForm({ metric, isOpen, onOpenChange }: EditMetricFormProps) {
  const { updateMetric } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      metric_date: metric ? parseISO(metric.metric_date) : new Date(),
      sleep_score: metric?.sleep_score ?? 0,
      readiness_score: metric?.readiness_score ?? 0,
      hrv: metric?.hrv ?? 0,
      spo2: metric?.spo2 ?? 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!metric) return;
    const toastId = toast.loading("Updating metric...");
    try {
      const payload = {
        ...values,
        id: metric.id,
        metric_date: format(values.metric_date, 'yyyy-MM-dd'),
      };
      const result = await updateMetric(payload);

      if (result.ok) {
        toast.success(result.message || "Metric updated successfully!", { id: toastId });
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update metric.", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Health Metric</DialogTitle>
          <DialogDescription>
            Make changes to your health data record. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="metric_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
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
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="sleep_score" render={({ field }) => ( <FormItem> <FormLabel>Sleep Score</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="readiness_score" render={({ field }) => ( <FormItem> <FormLabel>Readiness (%)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="hrv" render={({ field }) => ( <FormItem> <FormLabel>HRV (ms)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="spo2" render={({ field }) => ( <FormItem> <FormLabel>SpO2 (%)</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}