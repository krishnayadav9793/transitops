// Compatibility alias: tripController.js imports the supabase client from
// '../config/db.js'. Re-export the shared client from supabase.js so both
// import paths resolve to the same instance.
export { supabase } from './supabase.js';
