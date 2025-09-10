// // supabaseClient.js
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://hxtpqmvpxrwzcmgxycpd.supabase.co"
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dHBxbXZweHJ3emNtZ3h5Y3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjE5MzIsImV4cCI6MjA3MjkzNzkzMn0.HfZEXIrwD3-JLUDNvAQnbZg_82hvXF3hPvunai-zf4Q"

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
