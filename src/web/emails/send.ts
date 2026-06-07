import { env } from "cloudflare:workers";
import type { AppDb } from "../../db";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendDoneEmail(db: AppDb, videoId: string) {
  const video = await db.video.findUnique({
    where: { id: videoId },
    include: { user: true },
  });

  if (!video?.user?.email) {
    console.warn(`Skipping done email for video ${videoId}: no user email`);
    return;
  }

  const videoUrl = `${env.BASE_URL}/video/${video.id}`;
  const userName = escapeHtml(video.user.name);
  const videoTitle = escapeHtml(video.title);

  await env.SEND_EMAIL.send({
    from: "noreply@video.rad.gdn",
    to: video.user.email,
    subject: `Your video: ${video.title} is live`,
    // ToDo: Use react-email at some point :P
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827; max-width: 560px;">
        <h1 style="font-size: 22px; margin: 0 0 16px;">Your video is live</h1>
        <p style="margin: 0 0 12px;">Hey ${userName},</p>
        <p style="margin: 0 0 20px;">
          Your video <strong>${videoTitle}</strong> has completed processing and is ready to share.
        </p>
        <p style="margin: 0 0 24px;">
          <a href="${videoUrl}" style="background: #111827; color: #ffffff; padding: 10px 16px; border-radius: 6px; text-decoration: none; display: inline-block;">
            View video
          </a>
        </p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Or copy this link: <a href="${videoUrl}" style="color: #2563eb;">${videoUrl}</a>
        </p>
      </div>
    `,
  });
}
