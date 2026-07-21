import { schema, OutputType } from "./sent_GET.schema";
import superjson from "superjson";
import { db } from "../../helpers/db";
import { getServerUserSession } from "../../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const inquiries = await db
      .selectFrom("inquiries")
      .innerJoin("properties", "inquiries.propertyId", "properties.id")
      .innerJoin("users", "properties.userId", "users.id")
      .leftJoin("messages", "inquiries.id", "messages.inquiryId")
      .where("inquiries.guestId", "=", user.id)
      .select(({ fn }) => [
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
        "properties.title as propertyTitle",
        "properties.location as propertyLocation",
        "properties.photoUrls as propertyPhotoUrls",
        "properties.pricePerNight as propertyPricePerNight",
        "users.displayName as hostDisplayName",
        "users.avatarUrl as hostAvatarUrl",
        fn.count<string | number>("messages.id").as("messageCount"),
      ])
      .groupBy([
        "inquiries.id",
        "properties.title",
        "properties.location",
        "properties.photoUrls",
        "properties.pricePerNight",
        "users.displayName",
        "users.avatarUrl",
      ])
      .orderBy("inquiries.createdAt", "desc")
      .execute();

    const formattedInquiries = inquiries.map((iq) => ({
      ...iq,
      messageCount: Number(iq.messageCount),
    }));

    return new Response(superjson.stringify({ inquiries: formattedInquiries } satisfies OutputType));
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return new Response(superjson.stringify({ error: error.message }), { status: 400 });
  }
}