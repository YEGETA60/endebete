import { schema, OutputType } from "./availability_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const propertyIdStr = url.searchParams.get("propertyId");

    if (!propertyIdStr) {
      throw new Error("propertyId is required");
    }

    const validated = schema.parse({
      propertyId: parseInt(propertyIdStr, 10),
    });

    let userId: number | null = null;
    try {
      const { user } = await getServerUserSession(request);
      userId = user.id;
    } catch (e) {
      // User is not authenticated, which is fine for this endpoint.
      // They just won't see inquiries.
    }

    const property = await db
      .selectFrom("properties")
      .select("userId")
      .where("id", "=", validated.propertyId)
      .executeTakeFirst();

    if (!property) {
      return new Response(superjson.stringify({ error: "Property not found" }), { status: 404 });
    }

    const isOwner = userId === property.userId;

    const blockedDatesDb = await db
      .selectFrom("propertyBlockedDates")
      .select(["id", "startDate", "endDate", "reason", "createdAt"])
      .where("propertyId", "=", validated.propertyId)
      .execute();

    const blockedDates = blockedDatesDb.map((bd) => ({
      id: bd.id,
      startDate: new Date(bd.startDate as string | Date),
      endDate: new Date(bd.endDate as string | Date),
      reason: bd.reason,
      createdAt: new Date(bd.createdAt as string | Date || Date.now()),
    }));

    let inquiries: OutputType["inquiries"] = [];

    // Only fetch inquiries if the requester is the owner of the property
    if (isOwner) {
      const inquiriesDb = await db
        .selectFrom("inquiries")
        .innerJoin("users", "inquiries.guestId", "users.id")
        .select([
          "inquiries.id",
          "inquiries.checkInDate",
          "inquiries.checkOutDate",
          "inquiries.status",
          "inquiries.numGuests",
          "users.displayName as guestDisplayName",
        ])
        .where("inquiries.propertyId", "=", validated.propertyId)
        .execute();

      inquiries = inquiriesDb.map((inq) => ({
        id: inq.id,
        checkInDate: new Date(inq.checkInDate as string | Date),
        checkOutDate: new Date(inq.checkOutDate as string | Date),
        guestDisplayName: inq.guestDisplayName,
        status: inq.status,
        numGuests: inq.numGuests,
      }));
    }

    return new Response(
      superjson.stringify({
        blockedDates,
        inquiries,
      } satisfies OutputType)
    );
  } catch (error: any) {
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}