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
    console.log('--- Applying Authentication and Profile Migration ---');
    const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
        -- 1. Create profiles table
        CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            full_name TEXT,
            avatar_url TEXT,
            email TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- 2. Add user_id to orders
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users;

        -- 3. Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- 4. RLS Policies for Profiles
        CREATE POLICY "Users can view their own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
        
        CREATE POLICY "Users can update their own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);

        -- 5. RLS Policies for Orders (Authenticated users)
        -- Note: We might already have policies for admin. 
        -- We need one for customers to see their own orders.
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own orders'
            ) THEN
                CREATE POLICY "Users can view their own orders" ON public.orders
                    FOR SELECT USING (auth.uid() = user_id);
            END IF;
        END $$;

        -- 6. Trigger for profile creation on signup
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
            INSERT INTO public.profiles (id, full_name, avatar_url, email)
            VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
            return new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Clean up trigger if exists
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    ` });

    if (error) {
        console.log('Error applying migration:', error.message);
    } else {
        console.log('Authentication migration applied successfully!');
    }
}

migrate();
