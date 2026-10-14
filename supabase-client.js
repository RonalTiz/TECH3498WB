import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tech3498.vercel.app/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gEb9937qzIfhOulMFOZq1w_dKhB0LVU";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
