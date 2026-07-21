import { schema, OutputType } from "./unblock_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { getServerUserSession } from "../../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    // Verify the blocked date belongs to a property owned by the user
    const blockedDate = await db
      .selectFrom("propertyBlockedDates")
      .innerJoin("properties", "propertyBlockedDates.propertyId", "properties.id")
      .select(["propertyBlockedDates.id", "properties.userId"])
      .where("propertyBlockedDates.id", "=", validated.id)
      .executeTakeFirst();

    if (!blockedDate) {
      return new Response(superjson.stringify({ error: "Blocked date not found" }), {
        status: 404,
      });
    }

    if (blockedDate.userId !== user.id) {
      return new Response(
        superjson.stringify({ error: "Unauthorized: You do not own this property" }),
        { status: 403 }
      );
    }

    await db
      .deleteFrom("propertyBlockedDates")
      .where("id", "=", validated.id)
      .execute();

    return new Response(superjson.stringify({ success: true } satisfies OutputType));
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}