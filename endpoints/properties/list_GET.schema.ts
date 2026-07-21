import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Properties } from "../../helpers/schema";

export const SortEnum = z.enum(["newest", "price_low", "price_high"]);

 export const schema = z.object({
  location: z.string().optional(),
  guests: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  sort: SortEnum.optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type InputType = z.infer<typeof schema>;

export type PropertyListItem = Selectable<Properties> & {
  hostDisplayName: string;
  hostAvatarUrl: string | null;
};

export type OutputType = {
  properties: PropertyListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const getPropertiesList = async (
  query: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const params = new URLSearchParams();
  if (query.location) params.append("location", query.location);
  if (query.guests !== undefined) params.append("guests", query.guests.toString());
  if (query.minPrice !== undefined) params.append("minPrice", query.minPrice.toString());
  if (query.maxPrice !== undefined) params.append("maxPrice", query.maxPrice.toString());
  if (query.checkIn) params.append("checkIn", query.checkIn);
  if (query.checkOut) params.append("checkOut", query.checkOut);
  if (query.sort) params.append("sort", query.sort);
  if (query.page !== undefined) params.append("page", query.page.toString());
  if (query.limit !== undefined) params.append("limit", query.limit.toString());

  const result = await fetch(`/_api/properties/list?${params.toString()}`, {
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