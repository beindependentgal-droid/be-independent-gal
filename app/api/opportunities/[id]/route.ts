import { NextRequest } from "next/server";
import {
  supabase,
  successResponse,
  errorResponse,
  requireAuth,
  isAdmin,
} from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return successResponse(data);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to fetch opportunity", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;
  const { userId } = authResult;

  const admin = await isAdmin(userId);
  if (!admin) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("opportunities")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    return successResponse(data);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to update opportunity", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;
  const { userId } = authResult;

  const admin = await isAdmin(userId);
  if (!admin) return errorResponse("Forbidden", 403);

  try {
    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", params.id);
    if (error) throw error;
    return successResponse({ deleted: true });
  } catch (err: any) {
    return errorResponse(err.message || "Failed to delete opportunity", 500);
  }
}
