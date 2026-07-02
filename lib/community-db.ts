import { supabase } from "./api-utils";
import {
  postSchema,
  commentSchema,
  reactionSchema,
  bookmarkSchema,
  reportSchema,
} from "./db-validators";

export type PostType =
  | "text"
  | "image"
  | "video"
  | "link"
  | "location"
  | "poll"
  | "event"
  | "opportunity"
  | "academy"
  | "celebration"
  | "question"
  | "business_win";

export type VisibilityType = "public" | "private" | "connections" | "circles";

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  post_type: PostType;
  visibility: VisibilityType;
  location: string | null;
  link: string | null;
  metadata: Record<string, unknown>;
  comments_count: number;
  bookmarks_count: number;
  reaction_summary: Record<string, number>;
  is_pinned: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
}

export interface CommunityPostWithProfile extends CommunityPost {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    profession: string | null;
  };
  media: Array<{
    id: string;
    storage_path: string;
    url: string;
    file_type: string;
    width: number | null;
    height: number | null;
    position: number;
  }>;
  reactions: Array<{ id: string; user_id: string; reaction: string }>;
  bookmarked_by_user: boolean;
}

export interface CommentItem {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  user_id: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  likes_count: number;
  liked_by_user: boolean;
  replies: CommentItem[];
}

export async function getPostById(postId: string, userId: string | null) {
  const selectFields = [
    "*",
    "profiles:user_id( id, first_name, last_name, avatar_url, profession )",
    "post_media(*)",
    "post_reactions(*)",
  ];

  if (userId) {
    selectFields.push(`bookmarks!inner?user_id=eq.${userId}`);
  }

  const { data, error } = await supabase
    .from("posts")
    .select(selectFields.join(","))
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const reactions = data.post_reactions || [];

  return {
    ...data,
    profile: data.profiles,
    media: data.post_media || [],
    reactions,
    bookmarked_by_user: Boolean(data.bookmarks?.length),
  } as CommunityPostWithProfile;
}

export async function getFeed({
  query,
  filter,
  userId,
  page = 1,
  pageSize = 12,
}: {
  query?: string;
  filter?: string;
  userId?: string | null;
  page?: number;
  pageSize?: number;
}) {
  const selectFields = [
    "*",
    "profiles:user_id( id, first_name, last_name, avatar_url, profession )",
    "post_media(*)",
    "post_reactions(*)",
  ];

  if (userId) {
    selectFields.push(`bookmarks!inner?user_id=eq.${userId}`);
  }

  let q = supabase
    .from("posts")
    .select(selectFields.join(","), { count: "exact" })
    .eq("is_deleted", false)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (query) {
    q = q.textSearch("content", query, {
      config: "english",
      type: "plain",
    });
  }

  if (filter === "saved" && userId) {
    q = q.eq("bookmarks.user_id", userId);
  }

  if (filter === "my_posts" && userId) {
    q = q.eq("user_id", userId);
  }

  if (filter === "business_win") {
    q = q.eq("post_type", "business_win");
  }

  if (filter === "question") {
    q = q.eq("post_type", "question");
  }

  if (filter === "funding") {
    q = q.eq("post_type", "opportunity");
  }

  if (filter === "academy") {
    q = q.eq("post_type", "academy");
  }

  if (filter === "events") {
    q = q.eq("post_type", "event");
  }

  if (filter === "celebration") {
    q = q.eq("post_type", "celebration");
  }

  const from = (page - 1) * pageSize;
  const { data, count, error } = await q.range(from, from + pageSize - 1);

  if (error) {
    throw error;
  }

  const posts = ((data || []) as Array<Record<string, unknown>>).map((post) => {
    const typedPost = post as Record<string, unknown>;
    return {
      ...typedPost,
      profile: typedPost.profiles,
      media: typedPost.post_media || [],
      reactions: typedPost.post_reactions || [],
      bookmarked_by_user: Boolean(
        (typedPost.bookmarks as { length?: number } | undefined)?.length,
      ),
    } as CommunityPostWithProfile;
  });

  return { posts, count };
}

export async function createPost(userId: string, payload: unknown) {
  const validated = postSchema.parse(payload);
  const postPayload = {
    user_id: userId,
    content: validated.content,
    post_type: validated.post_type,
    visibility: validated.visibility,
    location: validated.location,
    link: validated.link,
    metadata: validated.metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(postPayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  await syncHashtags(data.id, validated.hashtags || []);

  return data as CommunityPost;
}

export async function updatePost(
  userId: string,
  postId: string,
  payload: unknown,
) {
  const validated = postUpdateSchema.parse(payload);
  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (fetchError || !existing) {
    throw fetchError || new Error("Post not found");
  }

  if (existing.user_id !== userId) {
    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      throw new Error("Unauthorized");
    }
  }

  const updatePayload: Record<string, unknown> = {
    ...validated,
    edited_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  Object.keys(updatePayload).forEach((key) => {
    if (updatePayload[key] === undefined) {
      delete updatePayload[key];
    }
  });

  const { data, error } = await supabase
    .from("posts")
    .update(updatePayload)
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  await syncHashtags(postId, validated.hashtags || []);

  return data as CommunityPost;
}

export async function deletePost(userId: string, postId: string) {
  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (fetchError || !existing) {
    throw fetchError || new Error("Post not found");
  }

  if (existing.user_id !== userId) {
    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      throw new Error("Unauthorized");
    }
  }

  const { error } = await supabase
    .from("posts")
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq("id", postId);

  if (error) {
    throw error;
  }

  return true;
}

export async function addReaction(
  userId: string,
  postId: string,
  reaction: string,
) {
  const validated = reactionSchema.parse({
    post_id: postId,
    reaction,
    user_id: userId,
  });

  const { data, error } = await supabase
    .from("post_reactions")
    .upsert(
      {
        post_id: validated.post_id,
        user_id: validated.user_id,
        reaction: validated.reaction,
      },
      { onConflict: ["post_id", "user_id"] },
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function removeReaction(userId: string, postId: string) {
  const { error } = await supabase
    .from("post_reactions")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function toggleBookmark(userId: string, postId: string) {
  const { data: existing, error: fetchError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  if (existing) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;
    return false;
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({ post_id: postId, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return true;
}

export async function createComment(
  userId: string,
  postId: string,
  payload: unknown,
) {
  const validated = commentSchema.parse({
    ...payload,
    user_id: userId,
    post_id: postId,
  });

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: validated.post_id,
      parent_comment_id: validated.parent_comment_id,
      user_id: validated.user_id,
      content: validated.content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateComment(
  userId: string,
  commentId: string,
  content: string,
) {
  const { data: existing, error: fetchError } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !existing) {
    throw fetchError || new Error("Comment not found");
  }

  if (existing.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("comments")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(userId: string, commentId: string) {
  const { data: existing, error: fetchError } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (fetchError || !existing) {
    throw fetchError || new Error("Comment not found");
  }

  if (existing.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq("id", commentId);

  if (error) throw error;
  return true;
}

export async function likeComment(userId: string, commentId: string) {
  const { data, error } = await supabase
    .from("comment_likes")
    .upsert(
      { comment_id: commentId, user_id: userId },
      { onConflict: ["comment_id", "user_id"] },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeCommentLike(userId: string, commentId: string) {
  const { error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function reportContent(userId: string, payload: unknown) {
  const validated = reportSchema.parse({ ...payload, reported_by: userId });

  const { data, error } = await supabase
    .from("reports")
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function syncHashtags(postId: string, tags: string[]) {
  const tagNames = [
    ...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
  ];

  if (!tagNames.length) {
    return;
  }

  const { data, error } = await supabase.from("hashtags").upsert(
    tagNames.map((tag) => ({ tag })),
    { onConflict: ["tag"] },
  );

  if (error) {
    throw error;
  }

  const hashtagRows = (data || []) as Array<Record<string, unknown>>;
  const inserts = hashtagRows.map((hashtag) => ({
    post_id: postId,
    hashtag_id: hashtag.id,
  }));

  const { error: mappingError } = await supabase
    .from("post_hashtags")
    .upsert(inserts, {
      onConflict: ["post_id", "hashtag_id"],
    });

  if (mappingError) {
    throw mappingError;
  }
}

async function isAdmin(userId: string) {
  const { data, error } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return ["admin", "super_admin", "moderator", "content_manager"].includes(
    data.role?.toLowerCase?.(),
  );
}
