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

async function check() {
    console.log('--- Checking home_sections visibility ---');
    const { data, error } = await supabase.from('home_sections').select('*').limit(1);

    if (error) {
        console.log('Status: ERROR');
        console.log('Code:', error.code);
        console.log('Message:', error.message);
        console.log('Hint:', error.hint);
    } else {
        console.log('Status: SUCCESS');
        console.log('Count:', data.length);
    }
}

check();
