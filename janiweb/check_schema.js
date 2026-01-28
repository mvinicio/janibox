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

async function probe() {
    const tablesToDetail = ['bases', 'treats', 'categories', 'orders'];
    for (const table of tablesToDetail) {
        console.log(`--- Columns in ${table} ---`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Error in ${table}:`, error.message);
        } else if (data && data.length > 0) {
            console.log(Object.keys(data[0]).join(', '));
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log(`No data in ${table}`);
        }
    }
}

probe();
