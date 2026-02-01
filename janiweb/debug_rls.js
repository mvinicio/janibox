import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkRLS() {
    console.log('--- Checking RLS Policies for coupons ---');
    const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: "SELECT * FROM pg_policies WHERE tablename = 'coupons';"
    });

    if (error) {
        console.error('Error checking RLS via RPC (exec_sql):', error.message);
        console.log('Maybe the RPC doesn\'t exist or doesn\'t have permissions.');
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

checkRLS();
