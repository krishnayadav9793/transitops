import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  try {
    console.log("Checking users table...");
    const { data: users, error: userError } = await supabase.from('users').select('*');
    if (userError) {
      console.error("Error fetching users:", userError);
    } else {
      console.log(`Found ${users.length} users:`, users);
    }

    console.log("Checking roles table...");
    const { data: roles, error: roleError } = await supabase.from('roles').select('*');
    if (roleError) {
      console.error("Error fetching roles:", roleError);
    } else {
      console.log(`Found ${roles.length} roles:`, roles);
    }
  } catch (err) {
    console.error("Inspection failed:", err);
  }
}

inspect();
