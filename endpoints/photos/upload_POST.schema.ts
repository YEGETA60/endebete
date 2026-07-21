import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  sizeBytes: z.number().positive().max(10 * 1024 * 1024, "File size must be less than 10MB"),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  presignedUrl: string;
  url: string;
};

export const postUploadPhoto = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/photos/upload`, {
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
    throw new Error(errorObject.error || "Failed to initiate upload");
  }
  
  return superjson.parse<OutputType>(await result.text());
};