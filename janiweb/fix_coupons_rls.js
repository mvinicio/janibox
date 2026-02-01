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

async function fixCouponsRLS() {
    console.log('--- Fixing Coupons Table RLS Policies ---');

    // First, let's check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
        .from('coupons')
        .select('*')
        .limit(1);

    if (tableError) {
        console.error('Error checking coupons table:', tableError.message);
        console.log('\nThe coupons table might not exist yet. Creating it now...');

        // Create the table with proper structure
        const { error: createError } = await supabase.rpc('exec_sql', {
            sql_query: `
                -- Create coupons table
                CREATE TABLE IF NOT EXISTS public.coupons (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    code TEXT UNIQUE NOT NULL,
                    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
                    discount_value NUMERIC NOT NULL,
                    min_purchase NUMERIC DEFAULT 0,
                    max_discount NUMERIC,
                    usage_limit INTEGER,
                    used_count INTEGER DEFAULT 0,
                    valid_until TIMESTAMPTZ,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );

                -- Enable RLS
                ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

                -- Allow authenticated users (admins) to do everything
                CREATE POLICY "Admins can manage coupons" ON public.coupons
                    FOR ALL
                    USING (auth.role() = 'authenticated');

                -- Allow public to read active coupons
                CREATE POLICY "Public can view active coupons" ON public.coupons
                    FOR SELECT
                    USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
            `
        });

        if (createError) {
            console.error('Error creating table via RPC:', createError.message);
            console.log('\nTrying alternative approach without RPC...');

            // If RPC doesn't work, we need to use the Supabase dashboard
            console.log('\n⚠️  MANUAL ACTION REQUIRED:');
            console.log('Please go to your Supabase dashboard and run this SQL:');
            console.log('\n--- SQL TO RUN IN SUPABASE DASHBOARD ---\n');
            console.log(`
-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_purchase NUMERIC DEFAULT 0,
    max_discount NUMERIC,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Allow public to read active coupons
CREATE POLICY "Public can view active coupons" ON public.coupons
    FOR SELECT
    USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
            `);
            console.log('\n--- END SQL ---\n');
        } else {
            console.log('✅ Coupons table created successfully with RLS policies!');
        }
    } else {
        console.log('Coupons table exists. Adding/updating RLS policies...');

        const { error: policyError } = await supabase.rpc('exec_sql', {
            sql_query: `
                -- Drop existing policies if any
                DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
                DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;

                -- Allow authenticated users (admins) to do everything
                CREATE POLICY "Admins can manage coupons" ON public.coupons
                    FOR ALL
                    USING (auth.role() = 'authenticated');

                -- Allow public to read active coupons
                CREATE POLICY "Public can view active coupons" ON public.coupons
                    FOR SELECT
                    USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
            `
        });

        if (policyError) {
            console.error('Error updating policies via RPC:', policyError.message);
            console.log('\n⚠️  MANUAL ACTION REQUIRED:');
            console.log('Please go to your Supabase dashboard and run this SQL:');
            console.log('\n--- SQL TO RUN IN SUPABASE DASHBOARD ---\n');
            console.log(`
-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Allow public to read active coupons
CREATE POLICY "Public can view active coupons" ON public.coupons
    FOR SELECT
    USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));
            `);
            console.log('\n--- END SQL ---\n');
        } else {
            console.log('✅ RLS policies updated successfully!');
        }
    }
}

fixCouponsRLS();
