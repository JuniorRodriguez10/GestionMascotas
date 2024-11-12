import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ieektypckqkjmguojyap.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZWt0eXBja3Fram1ndW9qeWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyODE5NjksImV4cCI6MjA0Njg1Nzk2OX0.UiMjHo9HHUpuLGNlqR9UuPyIrNILfRrnKICGxt0X_Gw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);




