import { defineApp } from "rwsdk/worker";
import { route, render, prefix, layout } from "rwsdk/router";
import { Document } from "@/web/Document";
import { Home } from "@/web/pages/Home";
import { setCommonHeaders } from "@/web/headers";
import { userRoutes } from "@/web/pages/user/routes";

import { createDb, type AppDb } from "@/db";
import { type Session, type User } from "better-auth";

import { env } from "cloudflare:workers";

import { uploadRoutes } from "./web/pages/upload/routes";
import orchestratorApp from "./orchestrator/server";
import { videoRoutes } from "./web/pages/video/routes";
import { createAuth } from "./web/lib/auth";
import { AppLayoutServer } from "./web/layout-server";
import { EmbedPage } from "./web/pages/embed";
import { parseThemeCookie, type Theme } from "./web/shared/theme";

export type AppContext = {
  db: AppDb;
  session: Session | null;
  user: User | null;
  authUrl: string;
  theme: Theme;
};

const app = defineApp([
  setCommonHeaders(),
  async ({ ctx, request }) => {
    const db = createDb(env);
    ctx.db = db;

    ctx.authUrl = env.BASE_URL;
    ctx.theme = parseThemeCookie(request.headers.get("Cookie"));

    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith("/embed/")) {
      ctx.session = null;
      ctx.user = null;
      return; // Early exist from auth setup for the embed page since we dont need auth there
    }

    const auth = await createAuth(env, db);
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    ctx.session = session?.session || null;
    ctx.user = session?.user || null;
  },
  route("/api/auth/*", async ({ request }) => {
    const { createAuth } = await import("./web/lib/auth");
    const auth = await createAuth(env, createDb(env));
    return auth.handler(request);
  }),

  render(Document, [
    route("/embed/:id", EmbedPage),
    prefix("/orchestrator", orchestratorApp),
    layout(AppLayoutServer, [
      route("/", Home),
      prefix("/user", userRoutes),
      prefix("/upload", uploadRoutes),
      prefix("/video", videoRoutes),
    ]),
  ]),
]);

export default { fetch: app.fetch } satisfies ExportedHandler<Env>;
