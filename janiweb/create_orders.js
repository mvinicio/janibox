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
    console.log('--- Creating Orders Table ---');
    const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
        CREATE TABLE IF NOT EXISTS public.orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_email TEXT NOT NULL,
            total NUMERIC NOT NULL,
            status TEXT NOT NULL DEFAULT 'received',
            items JSONB NOT NULL,
            delivery_address TEXT,
            delivery_slot TEXT,
            delivery_date DATE,
            payment_method TEXT,
            created_at TIMESTAMPTZ DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

        -- Policies (Ignore errors if they exist)
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read for all' AND tablename = 'orders') THEN
                CREATE POLICY "Enable read for all" ON public.orders FOR SELECT USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for all' AND tablename = 'orders') THEN
                CREATE POLICY "Enable insert for all" ON public.orders FOR INSERT WITH CHECK (true);
            END IF;
        END $$;
    ` });

    if (error) {
        console.log('Error applying migration:', error.message);
    } else {
        console.log('Migration applied successfully!');
    }
}

migrate();
