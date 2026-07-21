import webpush from "web-push";
import { db } from "./db";

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:support@endebete.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushToUser(
  userId: number,
  payload: {
    title: string;
    body: string;
    url?: string;
    icon?: string;
    tag?: string;
    data?: Record<string, unknown>;
    showWhenFocused?: boolean;
  }
) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return;
  }

  const rows = await db
    .selectFrom("pushSubscriptions")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  if (rows.length === 0) return;

  const payloadString = JSON.stringify(payload);
  const goneIdentities: string[] = [];

  await Promise.all(
    rows.map(async (row) => {
      try {
        const sub = row.subscription as any;
        if (sub && sub.endpoint) {
          await webpush.sendNotification(sub, payloadString);
        }
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          goneIdentities.push(row.identity);
        } else {
          console.error("WebPush send error:", err);
        }
      }
    })
  );

  if (goneIdentities.length > 0) {
    await db
      .deleteFrom("pushSubscriptions")
      .where("userId", "=", userId)
      .where("identity", "in", goneIdentities)
      .execute();
  }
}