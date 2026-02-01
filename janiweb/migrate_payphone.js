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
    console.log('--- Applying Product PayPhone Link Migration ---');
    const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
        ALTER TABLE bases ADD COLUMN IF NOT EXISTS payphone_link TEXT;
        ALTER TABLE treats ADD COLUMN IF NOT EXISTS payphone_link TEXT;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS payphone_link TEXT; 
    ` });

    if (error) {
        console.log('Error applying migration:', error.message);
    } else {
        console.log('Migration applied successfully!');
    }
}

migrate();
