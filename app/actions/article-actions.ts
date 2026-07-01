"use server";

import { createClient } from "@supabase/supabase-js";
import { articleSchema, articleCommentSchema } from "@/lib/db-validators";
import type { Article, ArticleComment } from "@/lib/db-types";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const candidateKeys = [serviceRoleKey, anonKey].filter(Boolean);

  if (!url || candidateKeys.length === 0) {
    return null;
  }

  for (const key of candidateKeys) {
    try {
      return createClient(url, key, { auth: { persistSession: false } });
    } catch {
      continue;
    }
  }

  return null;
}

const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    return (getSupabase() as any)[prop];
  },
});

export async function getPublishedArticles(limit = 20) {
  const client = getSupabase();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    // During build-time prerendering the table may not exist in the target database.
    // Return an empty list for missing-table errors so the build can complete.
    if (error.code === "PGRST205" || error.code === "PGRST116") {
      return [];
    }
    throw error;
  }

  return data;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

export async function getUserArticles(userId: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createArticle(
  authorId: string,
  input: unknown,
): Promise<Article> {
  const validated = articleSchema.parse(input);

  const { data, error } = await supabase
    .from("articles")
    .insert({
      ...validated,
      author_id: authorId,
      published_at:
        validated.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateArticle(
  articleId: string,
  authorId: string,
  input: unknown,
): Promise<Article> {
  const validated = articleSchema.parse(input);

  const { data, error } = await supabase
    .from("articles")
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
      published_at:
        validated.status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", articleId)
    .eq("author_id", authorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getArticleComments(articleId: string) {
  const { data, error } = await supabase
    .from("article_comments")
    .select(
      `
      *,
      author:author_id(full_name, avatar_url)
    `,
    )
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addArticleComment(
  articleId: string,
  authorId: string,
  input: unknown,
  parentId?: string,
): Promise<ArticleComment> {
  const validated = articleCommentSchema.parse(input);

  const { data, error } = await supabase
    .from("article_comments")
    .insert({
      article_id: articleId,
      author_id: authorId,
      content: validated.content,
      parent_comment_id: parentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
