import { schema, OutputType } from "./unsubscribe_POST.schema";
import superjson from "superjson";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    let query = db.deleteFrom("pushSubscriptions").where("userId", "=", user.id);

    if (input.identity) {
      query = query.where("identity", "=", input.identity);
    }

    await query.execute();

    return new Response(
      superjson.stringify({ success: true } satisfies OutputType)
    );
  } catch (error) {
    return new Response(
      superjson.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 400 }
    );
  }
}