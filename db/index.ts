import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL!;
const connection = postgres(connectionString, { prepare: false });

export const db = drizzle({ client: connection });



