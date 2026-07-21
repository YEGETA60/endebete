import { schema, OutputType } from "./toggle_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    // Check if favorite exists
    const existing = await db
      .selectFrom("userFavorites")
      .select("id")
      .where("userId", "=", user.id)
      .where("propertyId", "=", validated.propertyId)
      .executeTakeFirst();

    let isFavorite = false;

    if (existing) {
      // Remove favorite
      await db
        .deleteFrom("userFavorites")
        .where("id", "=", existing.id)
        .execute();
      isFavorite = false;
    } else {
      // Add favorite
      await db
        .insertInto("userFavorites")
        .values({
          userId: user.id,
          propertyId: validated.propertyId,
        })
        .execute();
      isFavorite = true;
    }

    return new Response(
      superjson.stringify({ isFavorite } satisfies OutputType),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      superjson.stringify({ error: error.message || "Bad Request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
