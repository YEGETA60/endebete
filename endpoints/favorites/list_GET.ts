import { OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const favorites = await db
      .selectFrom("userFavorites")
      .select("propertyId")
      .where("userId", "=", user.id)
      .execute();

    const propertyIds = favorites.map((f) => f.propertyId);

    return new Response(
      superjson.stringify({ propertyIds } satisfies OutputType),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(
        superjson.stringify({ propertyIds: [] } satisfies OutputType),
        { headers: { "Content-Type": "application/json" } }
      );
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
