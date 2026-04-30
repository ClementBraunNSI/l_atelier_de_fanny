function requiredSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error("Missing env NEXT_PUBLIC_SUPABASE_URL");
  return value;
}

function requiredSupabasePublicKey(): string {
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (publishable) return publishable;
  const legacyAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (legacyAnon) return legacyAnon;
  throw new Error(
    "Missing env NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY for legacy setup)",
  );
}

export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && requiredPublicKeyOptional());
}

export function readSupabaseEnv() {
  return {
    supabaseUrl: requiredSupabaseUrl(),
    supabaseAnonKey: requiredSupabasePublicKey(),
  };
}

function requiredPublicKeyOptional(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null
  );
}
