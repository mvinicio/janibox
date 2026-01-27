import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseData(table: string, options: { select?: string, order?: { column: string, ascending?: boolean }, filters?: any[] } = {}) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                let query = supabase.from(table).select(options.select || '*');

                if (options.filters) {
                    options.filters.forEach(f => {
                        query = query.filter(f.column, f.operator, f.value);
                    });
                }

                if (options.order) {
                    query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
                }

                const { data: result, error: err } = await query;
                if (err) throw err;
                setData(result || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [table, JSON.stringify(options)]);

    return { data, loading, error };
}
