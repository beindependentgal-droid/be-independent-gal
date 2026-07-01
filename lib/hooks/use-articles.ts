import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Article } from '@/lib/db-types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useArticles(limit = 20) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      try {
        const { data, error: err } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (err) throw err;

        if (isMounted) {
          setArticles(data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchArticles();

    const subscription = supabase
      .channel('articles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles',
          filter: 'status=eq.published',
        },
        (payload) => {
          if (isMounted) {
            if (payload.eventType === 'INSERT') {
              setArticles((prev) => [payload.new as Article, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setArticles((prev) =>
                prev.map((a) => (a.id === payload.new.id ? (payload.new as Article) : a))
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [limit]);

  return { articles, loading, error };
}
