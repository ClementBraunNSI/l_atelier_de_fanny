"use client";

import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  const { supabaseAnonKey, supabaseUrl } = readSupabaseEnv();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
