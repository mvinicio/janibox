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

async function checkSchema() {
    console.log('--- Checking Schema ---');
    // Try to select the column. If it doesn't exist, it might not error but return null or ignored?
    // Actually typically selecting a non-existent column in Supabase postgrest might error?
    // Let's select *
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error('Error fetching products:', error);
    } else if (data && data.length > 0) {
        const product = data[0];
        console.log('Product Keys:', Object.keys(product));
        if ('payphone_link' in product) {
            console.log('SUCCESS: payphone_link column EXISTS.');
        } else {
            console.log('FAILURE: payphone_link column DOES NOT EXIST.');
        }
    } else {
        console.log('No products found to check schema.');
    }
}

checkSchema();
