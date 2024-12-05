import { defineConfig, Config } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./db/schema.ts",
  out: "./drizzle",
} satisfies Config);
