import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Inquiries } from "../../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type SentInquiryItem = Selectable<Inquiries> & {
  propertyTitle: string;
  propertyLocation: string;
  propertyPhotoUrls: string[] | null;
  propertyPricePerNight: number;
  hostDisplayName: string;
  hostAvatarUrl: string | null;
  messageCount: number;
};

export type OutputType = {
  inquiries: SentInquiryItem[];
};

export const getSentInquiries = async (
  query: InputType = {},
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/inquiries/sent`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse<{ error: string }>(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};