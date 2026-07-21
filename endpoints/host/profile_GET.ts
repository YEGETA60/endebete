import { schema, OutputType } from "./profile_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get("userId");
    
    if (!userIdParam) {
      return new Response(superjson.stringify({ error: "userId is required" }), { status: 400 });
    }

    const validated = schema.parse({
      userId: parseInt(userIdParam, 10),
    });

    const user = await db
      .selectFrom("users")
      .select(["id", "displayName", "avatarUrl", "createdAt"])
      .where("id", "=", validated.userId)
      .executeTakeFirst();

    if (!user) {
      return new Response(superjson.stringify({ error: "Host not found" }), { status: 404 });
    }

    const properties = await db
      .selectFrom("properties")
      .selectAll()
      .where("userId", "=", validated.userId)
      .where("status", "=", "active")
      .orderBy("createdAt", "desc")
      .execute();

    return new Response(
      superjson.stringify({
        profile: {
          id: user.id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt as Date,
          propertyCount: properties.length,
        },
        properties,
      } satisfies OutputType)
    );
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}