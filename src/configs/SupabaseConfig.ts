import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmqvmbwqqvzagcaeqlak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcXZtYndxcXZ6YWdjYWVxbGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMjc5MzYsImV4cCI6MjA0OTkwMzkzNn0.kWQu7qt8eihwP9p0noEnRKR2Sv1Ps8cnQKPYucIcIAw';

export const supabase = createClient(supabaseUrl, supabaseKey);
