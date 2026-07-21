import { schema, OutputType } from "./update_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { getLocationCoordinates } from "../../helpers/ethiopianLocations";

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
    
    const coords = getLocationCoordinates(validated.location);
   
    const updatedProperty = await db
      .updateTable("properties")
      .set({
        title: validated.title,
        description: validated.description,
        location: validated.location,
        pricePerNight: validated.pricePerNight,
        bedrooms: validated.bedrooms,
        bathrooms: validated.bathrooms,
        maxGuests: validated.maxGuests,
        amenities: validated.amenities,
        photoUrls: validated.photoUrls,
        latitude: validated.latitude ?? coords?.lat ?? null,
        longitude: validated.longitude ?? coords?.lng ?? null,
        updatedAt: new Date(),
      })
      .where("id", "=", validated.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ property: updatedProperty } satisfies OutputType));
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}