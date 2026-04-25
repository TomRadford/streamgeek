import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "migrations",
    seed: "pnpm run worker:run ./src/scripts/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./.prisma/dev.db",
  },
});
