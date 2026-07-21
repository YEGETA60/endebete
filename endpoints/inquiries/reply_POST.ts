import { schema, OutputType } from "./reply_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { sendPushToUser } from "../../helpers/sendPushToUser";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    const inquiryInfo = await db
    .selectFrom("inquiries")
   .innerJoin("properties", "inquiries.propertyId", "properties.id")
   .select(["properties.userId as hostId", "inquiries.guestId as guestId", "inquiries.propertyId as propertyId", "properties.title as propertyTitle"])
   .where("inquiries.id", "=", validated.inquiryId)
   .executeTakeFirst();

    if (!inquiryInfo) {
      return new Response(superjson.stringify({ error: "Inquiry not found" }), { status: 404 });
    }

    if (inquiryInfo.hostId !== user.id && inquiryInfo.guestId !== user.id) {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const message = await db.transaction().execute(async (trx) => {
      const msg = await trx
        .insertInto("messages")
        .values({
          inquiryId: validated.inquiryId,
          senderId: user.id,
          text: validated.text,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      if (user.id === inquiryInfo.hostId) {
        await trx
          .updateTable("inquiries")
          .set({ status: "replied", updatedAt: new Date() })
          .where("id", "=", validated.inquiryId)
          .execute();
      }

      return msg;
    });

    const recipientId = user.id === inquiryInfo.hostId ? inquiryInfo.guestId : inquiryInfo.hostId;

    try {
      await sendPushToUser(recipientId, {
        title: "New Message",
        body: `You have a new message about ${inquiryInfo.propertyTitle}`,
        url: "/dashboard",
        tag: `msg-${message.id}`,
      });
    } catch (pushError) {
      console.error("Failed to send push notification:", pushError);
    }

    return new Response(superjson.stringify({ message } satisfies OutputType));
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}