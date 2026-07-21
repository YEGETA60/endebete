import { schema, OutputType } from "./block_POST.schema";
import superjson from "superjson";
import { db } from "../../../helpers/db";
import { getServerUserSession } from "../../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);

    if (endDate < startDate) {
      throw new Error("End date cannot be before start date");
    }

    const property = await db
      .selectFrom("properties")
      .select("userId")
      .where("id", "=", validated.propertyId)
      .executeTakeFirst();

    if (!property) {
      return new Response(superjson.stringify({ error: "Property not found" }), { status: 404 });
    }

    if (property.userId !== user.id) {
      return new Response(
        superjson.stringify({ error: "Unauthorized: You do not own this property" }),
        { status: 403 }
      );
    }

    const newBlockedDate = await db
      .insertInto("propertyBlockedDates")
      .values({
        propertyId: validated.propertyId,
        startDate: startDate,
        endDate: endDate,
        reason: validated.reason || null,
      })
      .returning(["id", "startDate", "endDate", "reason", "createdAt"])
      .executeTakeFirstOrThrow();

    const blockedDate = {
      id: newBlockedDate.id,
      startDate: new Date(newBlockedDate.startDate as string | Date),
      endDate: new Date(newBlockedDate.endDate as string | Date),
      reason: newBlockedDate.reason,
      createdAt: new Date(newBlockedDate.createdAt as string | Date || Date.now()),
    };

    return new Response(
      superjson.stringify({ blockedDate } satisfies OutputType)
    );
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}