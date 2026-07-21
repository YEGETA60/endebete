import { schema, OutputType } from "./create_POST.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { getLocationCoordinates } from "../../helpers/ethiopianLocations";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    const coords = getLocationCoordinates(validated.location);

    const property = await db
      .insertInto("properties")
      .values({
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
        userId: user.id,
        status: "active",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ property } satisfies OutputType));
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}