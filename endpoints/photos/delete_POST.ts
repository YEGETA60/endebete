import { schema, OutputType } from "./delete_POST.schema";
import superjson from "superjson";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import fs from "fs/promises";
import path from "path";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const validated = schema.parse(json);

    const urlObj = new URL(validated.url, "http://localhost");
    let filename = urlObj.pathname;
    
    filename = filename.replace(/^\/uploads\//, "");
    filename = filename.replace(/^\/_cdn\/public\//, "");
    filename = filename.replace(/^\/public\//, "");
    filename = filename.replace(/^\//, "");

    if (!filename) {
      return new Response(superjson.stringify({ error: "Invalid URL" }), {
        status: 400,
      });
    }

    // Security Check: Enforce user ownership of the file path
    const userPrefix = `properties/${user.id}/`;
    if (!filename.startsWith(userPrefix) && user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden: You do not own this photo" }),
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), "static", "uploads", filename);

    try {
      await fs.unlink(filePath);
    } catch (e: any) {
      if (e.code !== "ENOENT") {
        console.error("Error deleting file:", e);
      }
    }

    return new Response(
      superjson.stringify({
        success: true,
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