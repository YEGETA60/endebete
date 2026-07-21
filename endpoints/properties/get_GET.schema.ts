import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Properties } from "../../helpers/schema";

export const schema = z.object({
  id: z.number(),
});

export type InputType = z.infer<typeof schema>;

export type PropertyDetail = Selectable<Properties> & {
  hostDisplayName: string;
  hostAvatarUrl: string | null;
  hostEmail: string;
};

export type OutputType = {
  property: PropertyDetail;
};

export const getProperty = async (
  query: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const params = new URLSearchParams();
  params.append("id", query.id.toString());

  const result = await fetch(`/_api/properties/get?${params.toString()}`, {
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