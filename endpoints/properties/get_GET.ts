import { schema, OutputType } from "./get_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? parseInt(idParam, 10) : undefined;

    const validated = schema.parse({ id });

    const property = await db
      .selectFrom("properties")
      .innerJoin("users", "properties.userId", "users.id")
      .where("properties.id", "=", validated.id)
      .select([
        "properties.id",
        "properties.title",
        "properties.description",
        "properties.location",
        "properties.pricePerNight",
        "properties.bedrooms",
        "properties.bathrooms",
        "properties.maxGuests",
        "properties.amenities",
        "properties.photoUrls",
        "properties.latitude",
        "properties.longitude",
        "properties.status",
        "properties.userId",
        "properties.createdAt",
        "properties.updatedAt",
        "users.displayName as hostDisplayName",
        "users.avatarUrl as hostAvatarUrl",
        "users.email as hostEmail",
      ])
      .executeTakeFirst();

    if (!property) {
      return new Response(superjson.stringify({ error: "Property not found" }), { status: 404 });
    }

    return new Response(superjson.stringify({ property } satisfies OutputType));
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}