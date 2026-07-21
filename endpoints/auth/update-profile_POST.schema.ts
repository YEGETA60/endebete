import { z } from "zod";
import { User } from "../../helpers/User";
import superjson from "superjson";

export const schema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  avatarUrl: z.string().url().nullable().optional(),
  preferredLanguage: z.enum(["en", "am"]).optional(),
});

export type OutputType = {
  user: User;
};

export const postUpdateProfile = async (
  body: z.infer<typeof schema>,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/auth/update-profile`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorData = superjson.parse<{ message: string }>(await result.text());
    throw new Error(errorData.message || "Failed to update profile");
  }

  return superjson.parse<OutputType>(await result.text());
};