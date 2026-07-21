import { db } from "../../helpers/db";
import { schema } from "./change-password_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { compare, hash } from "bcryptjs";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);

    const json = superjson.parse(await request.text());
    const { currentPassword, newPassword } = schema.parse(json);

    const userPasswordResult = await db
      .selectFrom("userPasswords")
      .select("passwordHash")
      .where("userId", "=", user.id)
      .executeTakeFirst();

    if (!userPasswordResult) {
      throw new Error("Password record not found");
    }

    const passwordValid = await compare(currentPassword, userPasswordResult.passwordHash);
    if (!passwordValid) {
      return new Response(
        superjson.stringify({ message: "Incorrect current password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const newPasswordHash = await hash(newPassword, 12);

    await db
      .updateTable("userPasswords")
      .set({ passwordHash: newPasswordHash })
      .where("userId", "=", user.id)
      .execute();

    return new Response(
      superjson.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Password change failed";
    return new Response(
      superjson.stringify({ message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}