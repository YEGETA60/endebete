import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;
export type OutputType = {
  propertyIds: number[];
};

export async function getFavoritesList(
  init?: RequestInit
): Promise<OutputType> {
  const res = await fetch("/_api/favorites/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Failed to fetch favorites";
    try {
      const parsed = superjson.parse<{ error?: string; message?: string }>(text);
      message = parsed.error || parsed.message || message;
    } catch {}
    throw new Error(message);
  }

  return superjson.parse<OutputType>(await res.text());
}
