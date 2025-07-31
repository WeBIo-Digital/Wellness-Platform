"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, Workout } from "@/context/data-context";

const formSchema = z.object({
  workout_date: z.date({ required_error: "A date is required." }),
  type: z.string().min(1, "Workout type is required."),
  duration_minutes: z.coerce.number().min(1, "Duration must be at least 1 minute."),
  calories_burned: z.coerce.number().min(0),
  avg_heart_rate: z.coerce.number().min(0),
});

const workoutTypes = ["Running", "Weightlifting", "Cycling", "Yoga", "Swimming", "Hiking"];

interface EditWorkoutFormProps {
  workout: Workout | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWorkoutForm({ workout, isOpen, onOpenChange }: EditWorkoutFormProps) {
  const { updateWorkout } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (workout) {
      form.reset({
        workout_date: workout ? parseISO(workout.workout_date) : new Date(),
        type: workout?.type ?? undefined,
        duration_minutes: workout?.duration_minutes ?? 0,
        calories_burned: workout?.calories_burned ?? 0,
        avg_heart_rate: workout?.avg_heart_rate ?? 0,
      });
    }
  }, [workout, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!workout) return;
    const toastId = toast.loading("Updating workout...");
    try {
      const payload = { ...values, id: workout.id, workout_date: format(values.workout_date, 'yyyy-MM-dd HH:mm:ss') };
      const result = await updateWorkout(payload);

      if (result.ok) {
        toast.success(result.message || "Workout updated successfully!", { id: toastId });
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update workout.", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
          <DialogDescription>Make changes to your workout record.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField control={form.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Workout Type</FormLabel> <Select onValueChange={field.onChange} value={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a workout type" /> </SelectTrigger> </FormControl> <SelectContent> {workoutTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="workout_date" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> <FormMessage /> </FormItem> )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="duration_minutes" render={({ field }) => ( <FormItem> <FormLabel>Duration</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="calories_burned" render={({ field }) => ( <FormItem> <FormLabel>Calories</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="avg_heart_rate" render={({ field }) => ( <FormItem> <FormLabel>Avg HR</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
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