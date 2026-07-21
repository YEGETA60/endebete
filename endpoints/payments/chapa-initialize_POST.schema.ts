import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  amount: z.number().positive(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().optional().default("Guest"),
  phoneNumber: z.string().optional().default("0900000000"),
  title: z.string().optional().default("Accommodation Booking"),
  propertyId: z.number().int().optional(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = {
  checkoutUrl: string;
  txRef: string;
  isSimulated?: boolean;
};

export async function postInitializeChapa(
  body: InputType,
  init?: RequestInit
): Promise<OutputType> {
  const res = await fetch("/_api/payments/chapa-initialize", {
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
    let message = "Failed to initialize Chapa payment";
    try {
      const parsed = superjson.parse<{ error?: string; message?: string }>(text);
      message = parsed.error || parsed.message || message;
    } catch {}
    throw new Error(message);
  }

  return superjson.parse<OutputType>(await res.text());
}
