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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/data-context";

const formSchema = z.object({
  workout_date: z.date({ required_error: "A date is required." }),
  type: z.string().min(1, "Workout type is required."),
  duration_minutes: z.coerce.number().min(1, "Duration must be at least 1 minute."),
  calories_burned: z.coerce.number().min(0),
  avg_heart_rate: z.coerce.number().min(0),
});

const workoutTypes = ["Running", "Weightlifting", "Cycling", "Yoga", "Swimming", "Hiking"];

export function AddWorkoutForm() {
  const { addWorkout } = useData();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workout_date: new Date(),
      type: "",
      duration_minutes: 30,
      calories_burned: 300,
      avg_heart_rate: 130,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Adding new workout...");
    try {
      const payload = { ...values, workout_date: format(values.workout_date, 'yyyy-MM-dd HH:mm:ss') };
      const result = await addWorkout(payload);

      if (result.ok) {
        toast.success(result.message || "Workout added successfully!", { id: toastId });
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to add workout.", { id: toastId });
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
          Add Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Workout</DialogTitle>
              <DialogDescription>Manually enter a new workout record.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <FormField control={form.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Workout Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a workout type" /> </SelectTrigger> </FormControl> <SelectContent> {workoutTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="workout_date" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Date</FormLabel> <Popover> <PopoverTrigger asChild> <FormControl> <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> {field.value ? format(field.value, "PPP") : <span>Pick a date</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> </Button> </FormControl> </PopoverTrigger> <PopoverContent className="w-auto p-0" align="start"> <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> </PopoverContent> </Popover> <FormMessage /> </FormItem> )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="duration_minutes" render={({ field }) => ( <FormItem> <FormLabel>Duration</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="calories_burned" render={({ field }) => ( <FormItem> <FormLabel>Calories</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="avg_heart_rate" render={({ field }) => ( <FormItem> <FormLabel>Avg HR</FormLabel> <FormControl> <Input type="number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}> {isSubmitting ? "Saving..." : "Save Workout"} </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}