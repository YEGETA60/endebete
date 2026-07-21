import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { sendPushToUser } from "../../helpers/sendPushToUser";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    const property = await db
      .selectFrom("properties")
      .select(["id", "userId", "title"])
      .where("id", "=", validated.propertyId)
      .executeTakeFirstOrThrow();

      if (!property) {
        return new Response(superjson.stringify({ error: "Property not found" }), { status: 404 });
      }

      const inquiry = await db
        .insertInto("inquiries")
        .values({
          propertyId: validated.propertyId,
          guestId: user.id,
          checkInDate: validated.checkInDate,
          checkOutDate: validated.checkOutDate,
          numGuests: validated.numGuests,
          message: validated.message,
          status: "pending",
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      try {
        await sendPushToUser(property.userId, {
          title: "New Inquiry",
          body: `You have a new inquiry for ${property.title}`,
          url: "/dashboard",
          tag: `inquiry-${inquiry.id}`,
        });
      } catch (pushError) {
        console.error("Failed to send push notification for inquiry:", pushError);
      }

      return new Response(superjson.stringify({ inquiry } satisfies OutputType));
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}