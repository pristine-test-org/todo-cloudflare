import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  created_at: string;
};

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Null when the build had no Supabase settings; the app shows a setup message instead of a blank page. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const missingConfig = supabase
  ? null
  : "Tally can't reach its database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then rebuild.";
