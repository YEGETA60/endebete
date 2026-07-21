import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Properties } from "../../helpers/schema";

export const schema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  pricePerNight: z.number().positive(),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  maxGuests: z.number().min(1),
  amenities: z.array(z.string()),
  photoUrls: z.array(z.string()).max(5),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  property: Selectable<Properties>;
};

export const postUpdateProperty = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/properties/update`, {
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