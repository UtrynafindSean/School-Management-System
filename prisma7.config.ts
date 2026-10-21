import { config } from "dotenv";
import { defineConfig } from "prisma7/config";

config({ path: ".env.local" });
const databaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://local:local@localhost:5432/school?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
