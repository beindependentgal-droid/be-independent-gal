import { NextRequest } from "next/server";
import { errorResponse, getSupabase, successResponse } from "@/lib/api-utils";
import { getDefaultEmailAddress, sendEmail } from "@/lib/email";

const allowedContactMethods = ["email", "sms", "both"] as const;

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return errorResponse("Invalid request payload.", 400);
  }

  const {
    fullName,
    email,
    role,
    experience,
    goals,
    interests,
    contactMethod,
    updates,
  } = payload as {
    fullName?: string;
    email?: string;
    role?: string;
    experience?: string;
    goals?: string;
    interests?: unknown;
    contactMethod?: string;
    updates?: boolean;
  };

  if (
    !fullName?.trim() ||
    !email?.trim() ||
    !role?.trim() ||
    !experience?.trim() ||
    !goals?.trim()
  ) {
    return errorResponse("Please complete all required fields.", 400);
  }

  if (!isValidEmail(email)) {
    return errorResponse("Please provide a valid email address.", 400);
  }

  if (
    !allowedContactMethods.includes(
      (contactMethod as (typeof allowedContactMethods)[number]) || "email",
    )
  ) {
    return errorResponse("Please choose a valid contact preference.", 400);
  }

  const normalizedInterests = Array.isArray(interests)
    ? interests
        .filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
        .slice(0, 8)
    : [];

  const submission = {
    full_name: fullName.trim(),
    email: email.trim(),
    role: role.trim(),
    experience: experience.trim(),
    goals: goals.trim(),
    interests: normalizedInterests,
    contact_method: contactMethod || "email",
    updates: Boolean(updates),
  };

  let stored = false;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("form_submissions")
      .insert(submission);

    if (error) {
      throw error;
    }

    stored = true;
  } catch (error) {
    console.warn(
      "Form submission storage unavailable; continuing without persistence.",
      error,
    );
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "RESEND_API_KEY is not configured; skipping email delivery.",
      );
    } else {
      const toEmail =
        process.env.CONTACT_TO_EMAIL ||
        process.env.CONTACT_FORM_TO_EMAIL ||
        getDefaultEmailAddress("community");
      await sendEmail({
        from: process.env.RESEND_FROM_EMAIL || getDefaultEmailAddress("hello"),
        to: toEmail,
        replyTo: email.trim(),
        subject: "[BIG Community Form] New interest submission",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin-bottom: 12px;">New community form submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(fullName.trim())}</p>
            <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
            <p><strong>Role:</strong> ${escapeHtml(role.trim())}</p>
            <p><strong>Contact preference:</strong> ${escapeHtml(contactMethod || "email")}</p>
            <p><strong>Interests:</strong> ${escapeHtml(normalizedInterests.join(", ") || "None selected")}</p>
            <p><strong>Experience:</strong></p>
            <p>${escapeHtml(experience.trim()).replace(/\n/g, "<br />")}</p>
            <p><strong>Goals:</strong></p>
            <p>${escapeHtml(goals.trim()).replace(/\n/g, "<br />")}</p>
          </div>
        `,
      });
    }
  } catch (error) {
    console.warn("Unable to send form submission email:", error);
  }

  return successResponse({
    ok: true,
    stored,
    message: stored
      ? "Your response was submitted successfully."
      : "Your response was received. We’ll follow up as soon as the next sync is available.",
  });
}
