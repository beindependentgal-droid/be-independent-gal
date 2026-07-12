import { NextRequest } from "next/server";
import {
  supabase,
  successResponse,
  errorResponse,
  getPaginationParams,
} from "@/lib/api-utils";

const isRecoverableEventsError = (message: string) =>
  /permission denied|relation .* does not exist|table .* does not exist|does not exist|not found/i.test(
    message,
  );

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const upcoming =
    url.searchParams.get("upcoming") === "1" ||
    url.searchParams.get("upcoming") === "true";
  const status = url.searchParams.get("status");
  const { pageSize, offset } = getPaginationParams(request);

  try {
    if (!supabase) {
      return successResponse({
        events: [],
        total: 0,
        page: Math.floor(offset / pageSize) + 1,
        pageSize,
      });
    }

    let query = supabase
      .from("events")
      .select(
        "id, title, description, start_time, location, image_url, capacity, status",
        { count: "exact" },
      );

    if (upcoming) {
      query = query.in("status", ["upcoming", "ongoing"]);
    } else if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query
      .order("start_time", { ascending: true, nullsFirst: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      const message = error?.message || "Failed to fetch events";
      if (
        isRecoverableEventsError(message) ||
        /permission denied/i.test(message)
      ) {
        return successResponse({
          events: [],
          total: 0,
          page: Math.floor(offset / pageSize) + 1,
          pageSize,
        });
      }
      throw error;
    }

    return successResponse({
      events: data || [],
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch events", 500);
  }
}
