import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Messages } from "../../helpers/schema";

export const schema = z.object({
  inquiryId: z.number(),
  text: z.string().min(1),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  message: Selectable<Messages>;
};

export const postReplyInquiry = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/inquiries/reply`, {
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