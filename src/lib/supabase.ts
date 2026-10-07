import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  created_at: string;
};

// The project this list lives in. Both values are public by design (they ship in every browser bundle);
// the row-level security policies decide what the anon key may do. A host's VITE_* variables win when set.
const DEFAULT_URL = "https://hszqtfynyogshhltamep.supabase.co";
const DEFAULT_PUBLISHABLE_KEY = "sb_publishable_aCtosSr17ISoXGsoTazAbA_MiMNv78_"; // sb_publishable_…, the key Supabase now issues in place of the anon key

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const anonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (DEFAULT_PUBLISHABLE_KEY.startsWith("PASTE_") ? "" : DEFAULT_PUBLISHABLE_KEY);

/** Null when the build had no Supabase settings; the app shows a setup message instead of a blank page. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const missingConfig = supabase
  ? null
  : "Tally can't reach its database yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then rebuild.";
