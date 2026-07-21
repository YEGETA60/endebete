import { schema, OutputType } from "./upload_POST.schema";
import superjson from "superjson";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { nanoid } from "nanoid";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    let ext = "jpg";
    if (validated.contentType === "image/png") ext = "png";
    if (validated.contentType === "image/webp") ext = "webp";

    const storageFilename = `properties/${user.id}/${nanoid()}.${ext}`;
    const presignedUrl = `/_api/photos/upload_binary?path=${encodeURIComponent(storageFilename)}`;
    const url = `/uploads/${storageFilename}`;

    return new Response(
      superjson.stringify({
        presignedUrl,
        url,
      } satisfies OutputType)
    );
  } catch (error: any) {
    if (error.name === "NotAuthenticatedError") {
      return new Response(superjson.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    return new Response(
      superjson.stringify({ error: error.message || "Bad Request" }),
      { status: 400 }
    );
  }
}