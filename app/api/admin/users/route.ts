import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase, // Assuming this is your server-side Supabase client
  isAdmin,
  getPaginationParams,
  logAuditAction,
} from "@/lib/api-utils"; // Adjust this path if necessary

// GET /api/admin/users - List all users (admin only)
export async function GET(request: NextRequest) {
  // 1. Authenticate and Authorize User
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    // requireAuth returns an error Response if authentication fails
    return authResult;
  }

  const { userId } = authResult; // Assuming requireAuth returns { userId: string }

  // Check if the authenticated user is an administrator
  const adminCheck = await isAdmin(userId);
  if (!adminCheck) {
    await logAuditAction(
      userId,
      "Unauthorized attempt to list users",
      "admin_users_list_fail",
    );
    return errorResponse("Unauthorized access to admin resource.", 403);
  }

  // 2. Parse Request Parameters (Search and Pagination)
  const url = new URL(request.url);
  const search = url.searchParams.get("search"); // Search query
  const memberLevel = url.searchParams.get("member_level"); // Optional filter by member level
  const { pageSize, offset } = getPaginationParams(request); // Get pagination parameters

  try {
    // 3. Construct Supabase Query
    let query = supabase.from("profiles").select(
      `
        id,
        first_name,
        last_name,
        email,
        profession,
        city,
        avatar_url,
        member_level,
        points,
        created_at
        `, // Explicitly select relevant columns
      { count: "exact" }, // Request exact count for pagination metadata
    );

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      query = query.or(
        `first_name.ilike.%${searchLower}%,last_name.ilike.%${searchLower}%,email.ilike.%${searchLower}%`,
      );
    }

    // Apply member level filter if provided
    if (memberLevel) {
      query = query.eq("member_level", memberLevel);
    }

    // 4. Execute Query with Ordering and Pagination
    const {
      data: users,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false }) // Order by creation date, newest first
      .range(offset, offset + pageSize - 1); // Apply pagination range

    // Handle Supabase query errors
    if (error) {
      console.error("Supabase query error in GET /api/admin/users:", error);
      await logAuditAction(
        userId,
        `Failed to list users: ${error.message}`,
        "admin_users_list_error",
      );
      throw new Error(`Database error: ${error.message}`);
    }

    // 5. Log Successful Action
    await logAuditAction(
      userId,
      "Listed users successfully",
      "admin_users_list_success",
    );

    // 6. Return Success Response with Pagination Metadata
    return successResponse({
      users,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    console.error("API error in GET /api/admin/users:", error);
    return errorResponse(error.message, 500);
  }
}
