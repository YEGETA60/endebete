import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Inquiries, Messages } from "../../helpers/schema";

export const schema = z.object({
  inquiryId: z.number(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  inquiry: Selectable<Inquiries>;
  propertyTitle: string;
  messages: Selectable<Messages>[];
};

export const getInquiryMessages = async (
  query: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const params = new URLSearchParams();
  params.append("inquiryId", query.inquiryId.toString());

  const result = await fetch(`/_api/inquiries/messages?${params.toString()}`, {
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