import { defineConfig } from "prisma/config";
import { env } from "./src/env/index.ts";

console.log(env.DATABASE_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL as string,
  },
});
