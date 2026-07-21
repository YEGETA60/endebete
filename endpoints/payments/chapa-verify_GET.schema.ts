import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  txRef: z.string().min(1),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = {
  status: string;
  message: string;
  txRef: string;
  amount?: number;
};

export async function getVerifyChapa(
  txRef: string,
  init?: RequestInit
): Promise<OutputType> {
  const res = await fetch(`/_api/payments/chapa-verify?txRef=${encodeURIComponent(txRef)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Failed to verify Chapa payment";
    try {
      const parsed = superjson.parse<{ error?: string; message?: string }>(text);
      message = parsed.error || parsed.message || message;
    } catch {}
    throw new Error(message);
  }

  return superjson.parse<OutputType>(await res.text());
}
