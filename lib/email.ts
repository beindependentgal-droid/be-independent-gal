interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  from,
}: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        from ||
        process.env.RESEND_FROM_EMAIL ||
        "onboarding@beindependentgal.org",
      to: Array.isArray(to) ? to : [to],
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || "Unable to send email.");
  }

  return response.json().catch(() => ({ ok: true }));
}

export function getDefaultEmailAddress(
  kind: "hello" | "support" | "community" | "newsletter" | "noreply",
) {
  const defaults = {
    hello: "hello@beindependentgal.com",
    support: "support@beindependentgal.com",
    community: "community@beindependentgal.com",
    newsletter: "newsletter@beindependentgal.com",
    noreply: "noreply@beindependentgal.com",
  } as const;

  return defaults[kind];
}
