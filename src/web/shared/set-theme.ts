"use server";

import { requestInfo } from "rwsdk/worker";
import { isTheme, type Theme } from "@/web/shared/theme";

export async function setTheme(theme: Theme) {
  if (!isTheme(theme)) {
    return;
  }

  requestInfo.response.headers.set(
    "Set-Cookie",
    `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`,
  );
}
