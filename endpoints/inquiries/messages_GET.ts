import { schema, OutputType } from "./messages_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const url = new URL(request.url);
    const inquiryIdParam = url.searchParams.get("inquiryId");
    const inquiryId = inquiryIdParam ? parseInt(inquiryIdParam, 10) : undefined;

    const validated = schema.parse({ inquiryId });

    const inquiryInfo = await db
      .selectFrom("inquiries")
      .innerJoin("properties", "inquiries.propertyId", "properties.id")
      .select([
        "inquiries.id",
        "inquiries.propertyId",
        "inquiries.guestId",
        "inquiries.checkInDate",
        "inquiries.checkOutDate",
        "inquiries.numGuests",
        "inquiries.message",
        "inquiries.status",
        "inquiries.createdAt",
        "inquiries.updatedAt",
        "properties.userId as hostId",
        "properties.title as propertyTitle",
      ])
      .where("inquiries.id", "=", validated.inquiryId)
      .executeTakeFirst();

    if (!inquiryInfo) {
      return new Response(superjson.stringify({ error: "Inquiry not found" }), { status: 404 });
    }

    if (inquiryInfo.guestId !== user.id && inquiryInfo.hostId !== user.id) {
      return new Response(superjson.stringify({ error: "Unauthorized access" }), { status: 403 });
    }

    const messages = await db
      .selectFrom("messages")
      .where("inquiryId", "=", validated.inquiryId)
      .selectAll()
      .orderBy("createdAt", "asc")
      .execute();

    const { hostId, propertyTitle, ...inquiry } = inquiryInfo;

    return new Response(
      superjson.stringify({
        inquiry,
        propertyTitle,
        messages,
      } satisfies OutputType)
    );
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}