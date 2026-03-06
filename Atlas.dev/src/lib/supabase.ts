import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://yrmmxiqgevzhdpbdkwvy.supabase.co';  // colle directement
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybW14aXFnZXZ6aGRwYmRrd3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NDkzNDUsImV4cCI6MjA4ODAyNTM0NX0.2gY16mKRkvHDZcca-THh7e4iV6VT2bvTGRx6LkY1aTc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);