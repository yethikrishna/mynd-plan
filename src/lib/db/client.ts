import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

export const dbEnabled = Boolean(url);

// db is null when no DATABASE_URL is set — the app still runs fully,
// it just skips conversation persistence.
export const db = url
  ? drizzle(postgres(url, { prepare: false }), { schema })
  : null;
