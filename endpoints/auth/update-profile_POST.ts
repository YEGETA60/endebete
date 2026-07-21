import { db } from "../../helpers/db";
import { schema } from "./update-profile_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { User } from "../../helpers/User";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const { user: currentUser } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const { displayName, avatarUrl, preferredLanguage } = schema.parse(json);

    const updateData: {
      displayName: string;
      updatedAt: Date;
      avatarUrl?: string | null;
      preferredLanguage?: string;
    } = {
      displayName,
      updatedAt: new Date(),
    };

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    if (preferredLanguage !== undefined) {
      updateData.preferredLanguage = preferredLanguage;
    }

    const updatedUserResult = await db
      .updateTable("users")
      .set(updateData)
      .where("id", "=", currentUser.id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedUserResult) {
      throw new Error("User not found or update failed");
    }

    const returnedUser: User = {
      id: updatedUserResult.id,
      email: updatedUserResult.email,
      displayName: updatedUserResult.displayName,
      avatarUrl: updatedUserResult.avatarUrl,
      preferredLanguage: updatedUserResult.preferredLanguage,
      role: updatedUserResult.role,
    };

    return new Response(
      superjson.stringify({ user: returnedUser }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile update failed";
    return new Response(
      superjson.stringify({ message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}