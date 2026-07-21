import { schema, OutputType } from "./delete_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    // Verify property ownership
    const existing = await db
      .selectFrom("properties")
      .select("userId")
      .where("id", "=", validated.id)
      .executeTakeFirst();

    if (!existing) {
      return new Response(superjson.stringify({ error: "Property not found" }), { status: 404 });
    }

    if (existing.userId !== user.id) {
      return new Response(superjson.stringify({ error: "Unauthorized access" }), { status: 403 });
    }

    await db
      .updateTable("properties")
      .set({
        status: "inactive",
        updatedAt: new Date(),
      })
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