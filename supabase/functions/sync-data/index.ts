import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { format, subDays } from "https://esm.sh/date-fns@2.30.0";

// --- Shared Code: CORS Headers ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- Shared Code: Sample Data Generation ---
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const sampleMetrics = (userId: string) => Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
        user_id: userId,
        metric_date: format(date, 'yyyy-MM-dd'),
        sleep_score: rand(75, 95),
        readiness_score: rand(70, 98),
        hrv: rand(40, 75),
        spo2: rand(96, 99),
        sleep_awake_minutes: rand(10, 25),
        sleep_rem_minutes: rand(80, 120),
        sleep_light_minutes: rand(200, 280),
        sleep_deep_minutes: rand(60, 90),
    };
});

const sampleWorkouts = (userId: string) => [
    { user_id: userId, workout_date: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'), type: 'Weightlifting', duration_minutes: 60, calories_burned: 450, avg_heart_rate: 135 },
    { user_id: userId, workout_date: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'), type: 'Running', duration_minutes: 30, calories_burned: 300, avg_heart_rate: 155 },
    { user_id: userId, workout_date: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'), type: 'Cycling', duration_minutes: 75, calories_burned: 600, avg_heart_rate: 145 },
];

const sampleNutrition = (userId: string) => Array.from({ length: 7 }, (_, i) => ({
    user_id: userId,
    log_date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    calories: rand(2000, 2800),
    protein_grams: rand(140, 200),
    carbs_grams: rand(180, 250),
    fat_grams: rand(60, 90),
}));

const sampleBody = (userId: string) => Array.from({ length: 14 }, (_, i) => ({
    user_id: userId,
    measurement_date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    weight_kg: parseFloat((75 - (i * 0.1) + (Math.random() - 0.5)).toFixed(1)),
    body_fat_percentage: parseFloat((15 - (i * 0.05) + (Math.random() * 0.2 - 0.1)).toFixed(1)),
}));

const sampleDevices = (userId: string) => [
    { user_id: userId, name: 'Oura Ring Gen3', type: 'Watch', status: 'connected', details: 'Tracks sleep, readiness, and activity.', live_data_type: 'heartRate' },
    { user_id: userId, name: 'Apple Watch Ultra', type: 'Watch', status: 'disconnected', details: 'Advanced health and fitness tracking.', live_data_type: 'heartRate' },
    { user_id: userId, name: 'Levels CGM', type: 'Droplets', status: 'connected', details: 'Continuous glucose monitor for metabolic health.', live_data_type: 'glucose' },
    { user_id: userId, name: 'Withings Body+', type: 'Scale', status: 'disconnected', details: 'Smart scale for weight and body composition.' },
    { user_id: userId, name: 'Eight Sleep Pod', type: 'BedDouble', status: 'connected', details: 'Smart mattress for temperature control and sleep tracking.', live_data_type: 'temperature' },
    { user_id: userId, name: 'MyFitnessPal', type: 'Smartphone', status: 'disconnected', details: 'Nutrition and calorie tracking app.' },
];


// --- Main Function Logic ---
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await Promise.all([
        serviceClient.from('health_metrics').delete().eq('user_id', user.id),
        serviceClient.from('workouts').delete().eq('user_id', user.id),
        serviceClient.from('nutrition_logs').delete().eq('user_id', user.id),
        serviceClient.from('body_measurements').delete().eq('user_id', user.id),
        serviceClient.from('devices').delete().eq('user_id', user.id),
    ]);

    const dataToInsert = [
        { table: 'health_metrics', data: sampleMetrics(user.id) },
        { table: 'workouts', data: sampleWorkouts(user.id) },
        { table: 'nutrition_logs', data: sampleNutrition(user.id) },
        { table: 'body_measurements', data: sampleBody(user.id) },
        { table: 'devices', data: sampleDevices(user.id) },
    ];

    for (const item of dataToInsert) {
        const { error } = await serviceClient.from(item.table).insert(item.data);
        if (error) throw error;
    }

    return new Response(JSON.stringify({ message: 'Sample data synced successfully!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})