import { type GeneratedAlways, Kysely, CamelCasePlugin } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import { DB } from "./schema";
import postgres from "postgres";

const dbUrl = process.env.DATABASE_URL || process.env.FLOOT_DATABASE_URL || "";

export const db = new Kysely<DB>({
  plugins: [new CamelCasePlugin()],
  dialect: new PostgresJSDialect({
    postgres: postgres(dbUrl, {
      prepare: false,
      idle_timeout: 10,
      max: 3,
    }),
  }),
});
