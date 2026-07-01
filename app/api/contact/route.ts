import { NextResponse } from "next/server";
import { getDefaultEmailAddress, sendEmail } from "@/lib/email";

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

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);

  if (!data || typeof data !== "object") {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = data as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || getDefaultEmailAddress("hello");
  const toEmail =
    process.env.CONTACT_TO_EMAIL || getDefaultEmailAddress("support");

  try {
    await sendEmail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `[BIG Contact] ${subject.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 12px;">New contact form message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject.trim())}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message.trim()).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Your message was sent successfully.",
    });
  } catch (error) {
    console.error("Contact email send failed:", error);
    return NextResponse.json(
      {
        error: "Unable to send your message right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
