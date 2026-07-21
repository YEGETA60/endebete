import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  propertyId: z.number().int().positive(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = {
  isFavorite: boolean;
};

export async function postToggleFavorite(
  body: InputType,
  init?: RequestInit
): Promise<OutputType> {
  const res = await fetch("/_api/favorites/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: superjson.stringify(body),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Failed to toggle favorite";
    try {
      const parsed = superjson.parse<{ error?: string; message?: string }>(text);
      message = parsed.error || parsed.message || message;
    } catch {}
    throw new Error(message);
  }

  return superjson.parse<OutputType>(await res.text());
}
