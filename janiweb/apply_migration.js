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

async function migrate() {
    console.log('--- Applying Migration ---');
    const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS description TEXT,
        ADD COLUMN IF NOT EXISTS content TEXT,
        ADD COLUMN IF NOT EXISTS delivery_time TEXT,
        ADD COLUMN IF NOT EXISTS policies TEXT;
    ` });

    if (error) {
        console.log('Error applying migration via RPC:', error.message);
        console.log('Trying direct query if possible...');
        // Supabase client doesn't support raw SQL easily unless there's an RPC.
        // If RPC 'exec_sql' doesn't exist, we might be stuck with the MCP tool failure or manual SQL.
        // However, I'll try to use the mcp_supabase-mcp-server_execute_sql but it might have the same error.
    } else {
        console.log('Migration applied successfully!');
    }
}

migrate();
