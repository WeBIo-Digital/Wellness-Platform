"use client";

import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { supabase } from '@/integrations/supabase/client';

// --- Data Types ---
export type HealthMetric = { id: number; user_id: string; metric_date: string; sleep_score: number; readiness_score: number; hrv: number; spo2: number; sleep_awake_minutes: number; sleep_rem_minutes: number; sleep_light_minutes: number; sleep_deep_minutes: number; };
export type Workout = { id: number; user_id: string; workout_date: string; type: string; duration_minutes: number; calories_burned: number; avg_heart_rate: number; };
export type NutritionLog = { id: number; user_id: string; log_date: string; calories: number; protein_grams: number; carbs_grams: number; fat_grams: number; };
export type BodyMeasurement = { id: number; user_id: string; measurement_date: string; weight_kg: number; body_fat_percentage: number; };
export type Device = { id: number; user_id: string; name: string; type: string; status: 'connected' | 'disconnected'; details: string | null; live_data_type: string | null; battery_level: number | null; };
export type Milestone = { id: number; user_id: string; milestone_date: string; title: string; description: string; };

// --- Context Type ---
type DataContextType = {
  metrics: HealthMetric[];
  workouts: Workout[];
  nutritionLogs: NutritionLog[];
  bodyMeasurements: BodyMeasurement[];
  devices: Device[];
  milestones: Milestone[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
  syncData: () => Promise<{ ok: boolean; message?: string; error?: string; }>;
  addMetric: (data: Omit<HealthMetric, 'id' | 'user_id' | 'created_at'>) => Promise<{ ok: boolean; message?: string }>;
  updateMetric: (data: Partial<HealthMetric> & { id: number }) => Promise<{ ok: boolean; message?: string }>;
  deleteMetric: (id: number) => Promise<{ ok: boolean; message?: string }>;
  addWorkout: (data: Omit<Workout, 'id' | 'user_id' | 'created_at'>) => Promise<{ ok: boolean; message?: string }>;
  updateWorkout: (data: Partial<Workout> & { id: number }) => Promise<{ ok: boolean; message?: string }>;
  deleteWorkout: (id: number) => Promise<{ ok: boolean; message?: string }>;
  addNutritionLog: (data: Omit<NutritionLog, 'id' | 'user_id' | 'created_at'>) => Promise<{ ok: boolean; message?: string }>;
  updateNutritionLog: (data: Partial<NutritionLog> & { id: number }) => Promise<{ ok: boolean; message?: string }>;
  deleteNutritionLog: (id: number) => Promise<{ ok: boolean; message?: string }>;
  addBodyMeasurement: (data: Omit<BodyMeasurement, 'id' | 'user_id' | 'created_at'>) => Promise<{ ok: boolean; message?: string }>;
  updateBodyMeasurement: (data: Partial<BodyMeasurement> & { id: number }) => Promise<{ ok: boolean; message?: string }>;
  deleteBodyMeasurement: (id: number) => Promise<{ ok: boolean; message?: string }>;
  updateDevice: (data: Partial<Device> & { id: number }) => Promise<{ ok: boolean; message?: string }>;
  deleteDevice: (id: number) => Promise<{ ok: boolean; message?: string }>;
  addMilestone: (data: Omit<Milestone, 'id' | 'user_id' | 'created_at'>) => Promise<{ ok: boolean; message?: string }>;
  deleteMilestone: (id: number) => Promise<{ ok: boolean; message?: string }>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [metricsRes, workoutsRes, nutritionRes, bodyRes, devicesRes, milestonesRes] = await Promise.all([
        supabase.from('health_metrics').select('*').order('metric_date', { ascending: false }).limit(180),
        supabase.from('workouts').select('*').order('workout_date', { ascending: false }).limit(180),
        supabase.from('nutrition_logs').select('*').order('log_date', { ascending: false }).limit(180),
        supabase.from('body_measurements').select('*').order('measurement_date', { ascending: false }).limit(180),
        supabase.from('devices').select('*').order('created_at', { ascending: false }),
        supabase.from('milestones').select('*').order('milestone_date', { ascending: false }),
      ]);

      if (metricsRes.data) setMetrics(metricsRes.data);
      if (workoutsRes.data) setWorkouts(workoutsRes.data);
      if (nutritionRes.data) setNutritionLogs(nutritionRes.data);
      if (bodyRes.data) setBodyMeasurements(bodyRes.data);
      if (devicesRes.data) setDevices(devicesRes.data);
      if (milestonesRes.data) setMilestones(milestonesRes.data);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const syncData = async () => {
    const { data, error } = await supabase.functions.invoke('sync-data');
    if (error) {
      return { ok: false, error: error.message };
    }
    await fetchData();
    return { ok: true, ...data };
  };

  const handleMutation = async (promise: PromiseLike<any>, successMessage: string) => {
    const { error } = await promise;
    if (error) {
      console.error(error.message);
      return { ok: false, message: error.message };
    }
    await fetchData();
    return { ok: true, message: successMessage };
  };

  const addMetric = (data: any) => handleMutation(supabase.from('health_metrics').insert({ ...data, user_id: user!.id }), 'Metric added');
  const updateMetric = (data: any) => handleMutation(supabase.from('health_metrics').update(data).eq('id', data.id), 'Metric updated');
  const deleteMetric = (id: number) => handleMutation(supabase.from('health_metrics').delete().eq('id', id), 'Metric deleted');

  const addWorkout = (data: any) => handleMutation(supabase.from('workouts').insert({ ...data, user_id: user!.id }), 'Workout added');
  const updateWorkout = (data: any) => handleMutation(supabase.from('workouts').update(data).eq('id', data.id), 'Workout updated');
  const deleteWorkout = (id: number) => handleMutation(supabase.from('workouts').delete().eq('id', id), 'Workout deleted');

  const addNutritionLog = (data: any) => handleMutation(supabase.from('nutrition_logs').insert({ ...data, user_id: user!.id }), 'Log added');
  const updateNutritionLog = (data: any) => handleMutation(supabase.from('nutrition_logs').update(data).eq('id', data.id), 'Log updated');
  const deleteNutritionLog = (id: number) => handleMutation(supabase.from('nutrition_logs').delete().eq('id', id), 'Log deleted');

  const addBodyMeasurement = (data: any) => handleMutation(supabase.from('body_measurements').insert({ ...data, user_id: user!.id }), 'Measurement added');
  const updateBodyMeasurement = (data: any) => handleMutation(supabase.from('body_measurements').update(data).eq('id', data.id), 'Measurement updated');
  const deleteBodyMeasurement = (id: number) => handleMutation(supabase.from('body_measurements').delete().eq('id', id), 'Measurement deleted');

  const updateDevice = (data: any) => handleMutation(supabase.from('devices').update(data).eq('id', data.id), 'Device updated');
  const deleteDevice = (id: number) => handleMutation(supabase.from('devices').delete().eq('id', id), 'Device deleted');

  const addMilestone = (data: any) => handleMutation(supabase.from('milestones').insert({ ...data, user_id: user!.id }), 'Milestone added');
  const deleteMilestone = (id: number) => handleMutation(supabase.from('milestones').delete().eq('id', id), 'Milestone deleted');

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
      setMetrics([]); setWorkouts([]); setNutritionLogs([]); setBodyMeasurements([]); setDevices([]); setMilestones([]);
    }
  }, [user, fetchData]);

  const value = {
    metrics, workouts, nutritionLogs, bodyMeasurements, devices, milestones, isLoading, fetchData, syncData,
    addMetric, updateMetric, deleteMetric,
    addWorkout, updateWorkout, deleteWorkout,
    addNutritionLog, updateNutritionLog, deleteNutritionLog,
    addBodyMeasurement, updateBodyMeasurement, deleteBodyMeasurement,
    updateDevice, deleteDevice,
    addMilestone, deleteMilestone,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};