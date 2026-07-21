import { z } from "zod";
import superjson from "superjson";
import { BlockedDate } from "../availability_GET.schema";

export const schema = z.object({
  propertyId: z.number(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }),
  reason: z.string().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  blockedDate: BlockedDate;
};

export const postBlockPropertyDate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/properties/availability/block`, {
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