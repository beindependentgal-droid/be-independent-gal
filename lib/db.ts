import * as fs from "fs/promises";
import * as path from "path";
import supabaseClient from "./supabase";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    rank: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  title: string;
  city: string;
  rank: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "meetup" | "webinar" | "retreat";
  attendees: number;
  rsvped?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  completed?: boolean;
  badge: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "guide" | "book";
  size?: string;
  duration?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  notifications: NotificationItem[];
  feed: Post[];
  members: Member[];
  events: Event[];
  challenges: Challenge[];
  resources: Resource[];
}

interface DatabaseFile {
  circleDashboard: Record<string, DashboardData>;
  communityFeed?: Post[];
}

const DATABASE_PATH = path.join(process.cwd(), "data", "circle-dashboard.json");

async function readDatabase(): Promise<DatabaseFile | null> {
  try {
    const raw = await fs.readFile(DATABASE_PATH, "utf-8");
    return JSON.parse(raw) as DatabaseFile;
  } catch (error) {
    return null;
  }
}

async function writeDatabase(database: DatabaseFile) {
  await fs.writeFile(DATABASE_PATH, JSON.stringify(database, null, 2), "utf-8");
}

export async function getCircleDashboardData(circleId: string) {
  // Prefer Supabase when configured
  if (supabaseClient) {
    const res = await supabaseClient
      .from("circle_dashboard")
      .select("data")
      .eq("id", circleId)
      .single();

    if (res.error || !res.data) return null;
    return (res.data as any).data as DashboardData;
  }

  const database = await readDatabase();
  return database?.circleDashboard?.[circleId] ?? null;
}

export async function addCirclePost(circleId: string, content: string) {
  // Supabase-backed flow
  if (supabaseClient) {
    const row = await supabaseClient
      .from("circle_dashboard")
      .select("data")
      .eq("id", circleId)
      .single();

    if (row.error || !row.data) return null;

    const current = (row.data as any).data as DashboardData;

    const newPost: Post = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}`,
      author: {
        name: "You",
        avatar: "/images/member-1.png",
        rank: "Community Champion",
      },
      content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
    };

    const updated: DashboardData = {
      ...current,
      feed: [newPost, ...current.feed],
    };

    const upd = await supabaseClient
      .from("circle_dashboard")
      .update({ data: updated })
      .eq("id", circleId);

    if (upd.error) return null;
    return newPost;
  }

  const database = await readDatabase();

  if (!database || !database.circleDashboard[circleId]) {
    return null;
  }

  const feed = database.circleDashboard[circleId].feed;
  const newPost: Post = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}`,
    author: {
      name: "You",
      avatar: "/images/member-1.png",
      rank: "Community Champion",
    },
    content,
    timestamp: "Just now",
    likes: 0,
    comments: 0,
    liked: false,
  };

  database.circleDashboard[circleId].feed = [newPost, ...feed];
  await writeDatabase(database);

  return newPost;
}

export async function getCommunityFeed() {
  const database = await readDatabase();
  if (!database) {
    return [];
  }

  if (database.communityFeed) {
    return database.communityFeed;
  }

  return Object.values(database.circleDashboard).flatMap(
    (circle) => circle.feed ?? [],
  );
}

export async function addCommunityPost(content: string) {
  const database = await readDatabase();
  if (!database) {
    return null;
  }

  const newPost: Post = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}`,
    author: {
      name: "You",
      avatar: "/images/member-1.png",
      rank: "Community Champion",
    },
    content,
    timestamp: "Just now",
    likes: 0,
    comments: 0,
    liked: false,
  };

  const currentFeed =
    database.communityFeed ??
    Object.values(database.circleDashboard).flatMap(
      (circle) => circle.feed ?? [],
    );

  database.communityFeed = [newPost, ...currentFeed];
  await writeDatabase(database);

  return newPost;
}

export async function updateCommunityPost(id: string, content: string) {
  const database = await readDatabase();
  if (!database) {
    return null;
  }

  const currentFeed =
    database.communityFeed ??
    Object.values(database.circleDashboard).flatMap(
      (circle) => circle.feed ?? [],
    );

  let found = false;
  const updatedFeed = currentFeed.map((post) => {
    if (post.id === id) {
      found = true;
      return {
        ...post,
        content,
        timestamp: "Updated just now",
      };
    }
    return post;
  });

  if (!found) {
    return null;
  }

  database.communityFeed = updatedFeed;
  await writeDatabase(database);

  return updatedFeed.find((post) => post.id === id) ?? null;
}

export async function deleteCommunityPost(id: string) {
  const database = await readDatabase();
  if (!database) {
    return false;
  }

  const currentFeed =
    database.communityFeed ??
    Object.values(database.circleDashboard).flatMap(
      (circle) => circle.feed ?? [],
    );

  const updatedFeed = currentFeed.filter((post) => post.id !== id);
  if (updatedFeed.length === currentFeed.length) {
    return false;
  }

  database.communityFeed = updatedFeed;
  await writeDatabase(database);

  return true;
}
