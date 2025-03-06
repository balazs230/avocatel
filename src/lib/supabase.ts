import { createClient } from '@supabase/supabase-js'

const options = {
db: {
  schema: 'public',
},
auth: {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
},
globals: {
  headers: {
    'x-avocatel-header': 'avocatel'},
},
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  options
);

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);