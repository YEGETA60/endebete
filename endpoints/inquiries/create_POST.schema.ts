import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Inquiries } from "../../helpers/schema";

export const schema = z.object({
  propertyId: z.number(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  numGuests: z.number().min(1),
  message: z.string().min(1),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  inquiry: Selectable<Inquiries>;
};

export const postCreateInquiry = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/inquiries/create`, {
    method: "POST",
    body: superjson.stringify(body),
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