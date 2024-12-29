import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytxmcpbuxkdtwqaewdpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eG1jcGJ1eGtkdHdxYWV3ZHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0ODY5NDIsImV4cCI6MjA1MTA2Mjk0Mn0._dT1j14JAq258Zs0OwXhWtCX3TGmgv7leAJA-3SUq2w';

export const supabase = createClient(supabaseUrl, supabaseKey);
