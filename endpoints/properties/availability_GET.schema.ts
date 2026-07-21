import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  propertyId: z.number(),
});

export type InputType = z.infer<typeof schema>;

export type BlockedDate = {
  id: number;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  createdAt: Date;
};

export type InquiryRange = {
  id: number;
  checkInDate: Date;
  checkOutDate: Date;
  guestDisplayName: string;
  status: string;
  numGuests: number;
};

export type OutputType = {
  blockedDates: BlockedDate[];
  inquiries: InquiryRange[];
};

export const getPropertyAvailability = async (
  query: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const params = new URLSearchParams();
  params.append("propertyId", query.propertyId.toString());

  const result = await fetch(`/_api/properties/availability?${params.toString()}`, {
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