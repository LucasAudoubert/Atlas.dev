import dotenv from "dotenv";

dotenv.config();

export const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  supabasePublishableDefaultKey: process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
};
