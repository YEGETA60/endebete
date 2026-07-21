import { schema, OutputType } from "./list_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const location = url.searchParams.get("location");
    const guestsParam = url.searchParams.get("guests");
    const guests = guestsParam ? parseInt(guestsParam, 10) : undefined;
    const minPriceParam = url.searchParams.get("minPrice");
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPriceParam = url.searchParams.get("maxPrice");
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
    const checkIn = url.searchParams.get("checkIn") || undefined;
    const checkOut = url.searchParams.get("checkOut") || undefined;
    const sort = url.searchParams.get("sort") || undefined;
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 12;

    const validated = schema.parse({
      location: location || undefined,
      guests: guests || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      sort: sort || undefined,
      page: page || 1,
      limit: limit || 12,
    });

    const currentPage = validated.page ?? 1;
    const currentLimit = validated.limit ?? 12;

    let baseQuery = db
      .selectFrom("properties")
      .innerJoin("users", "properties.userId", "users.id")
      .where("properties.status", "=", "active");

    if (validated.location) {
      baseQuery = baseQuery.where("properties.location", "ilike", `%${validated.location}%`);
    }

    if (validated.guests) {
      baseQuery = baseQuery.where("properties.maxGuests", ">=", validated.guests);
    }

    if (validated.minPrice) {
      baseQuery = baseQuery.where("properties.pricePerNight", ">=", validated.minPrice);
    }

    if (validated.maxPrice) {
      baseQuery = baseQuery.where("properties.pricePerNight", "<=", validated.maxPrice);
    }

    if (validated.checkIn && validated.checkOut) {
      const checkInDate = new Date(validated.checkIn);
      const checkOutDate = new Date(validated.checkOut);
      baseQuery = baseQuery.where(({ eb, selectFrom }) =>
        eb(
          "properties.id",
          "not in",
          selectFrom("propertyBlockedDates")
            .select("propertyBlockedDates.propertyId")
            .where("propertyBlockedDates.startDate", "<", checkOutDate)
            .where("propertyBlockedDates.endDate", ">", checkInDate)
        )
      );
    }

    const countResult = await baseQuery
      .clearSelect()
      .select((eb) => eb.fn.count("properties.id").as("total"))
      .executeTakeFirst();

    const total = Number(countResult?.total ?? 0);

    const properties = await baseQuery
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
      ])
      .orderBy(
        validated.sort === "price_low"
          ? "properties.pricePerNight"
          : validated.sort === "price_high"
            ? "properties.pricePerNight"
            : "properties.createdAt",
        validated.sort === "price_low" ? "asc" : "desc"
      )
      .limit(currentLimit)
      .offset((currentPage - 1) * currentLimit)
      .execute();

    return new Response(
      superjson.stringify({
        properties,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
      } satisfies OutputType)
    );
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}