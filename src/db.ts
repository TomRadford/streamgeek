import { PrismaClient } from "@generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export type * from "@generated/prisma/client";

export type AppDb = PrismaClient;

export const createDb = (env: Env) =>
  new PrismaClient({
    adapter: new PrismaD1(env.DB),
  });
