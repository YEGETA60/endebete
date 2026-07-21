import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Properties } from "../../helpers/schema";

export const schema = z.object({
  userId: z.number(),
});

export type InputType = z.infer<typeof schema>;

export type HostPropertyListItem = Selectable<Properties>;

export type HostProfileType = {
  id: number;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Date | null;
  propertyCount: number;
};

export type OutputType = {
  profile: HostProfileType;
  properties: HostPropertyListItem[];
};

export const getHostProfile = async (
  query: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const params = new URLSearchParams();
  params.append("userId", query.userId.toString());

  const result = await fetch(`/_api/host/profile?${params.toString()}`, {
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