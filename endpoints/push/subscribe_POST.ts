import { schema, OutputType } from "./subscribe_POST.schema";
import superjson from "superjson";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { db } from "../../helpers/db";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    // Delete old identity if it was rotated
    if (input.previousIdentity && input.previousIdentity !== input.identity) {
      await db
        .deleteFrom("pushSubscriptions")
        .where("userId", "=", user.id)
        .where("identity", "=", input.previousIdentity)
        .execute();
    }

    // Upsert the new subscription
    // Pass the object directly (no JSON.stringify) for jsonb storage
    await db
      .insertInto("pushSubscriptions")
      .values({
        userId: user.id,
        identity: input.identity,
        subscription: input.subscription as any,
      })
      .onConflict((oc) =>
        oc.columns(["userId", "identity"]).doUpdateSet({
          subscription: input.subscription as any,
        })
      )
      .execute();

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