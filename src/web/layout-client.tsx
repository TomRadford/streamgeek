"use client";

import { ModeToggle } from "@/web/components/mode-toggle";
import { Button } from "@/web/components/ui/button";
import { authClient } from "@/web/lib/auth-client";
import { Video, LogIn, LogOut, HardDriveUpload } from "lucide-react";
import { Session } from "better-auth";
import { link } from "./shared/links";
import { navigate } from "rwsdk/client";
import { DEFAULT_THEME, type Theme } from "./shared/theme";
import { useNavigationLoading } from "@/web/lib/navigation-loading";

export function AppLayoutClient({
  children,
  session,
  initialTheme = DEFAULT_THEME,
}: {
  children: React.ReactNode;
  session?: Session | null;
  initialTheme?: Theme;
}) {
  const isNavigationLoading = useNavigationLoading();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      void navigate(link("/user/login"), { history: "replace" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogin = () => {
    void navigate(link("/user/login"));
  };

  return (
    <div className=" mx-8 sm:mx-24 my-8 flex flex-col gap-8 2xl:mx-48">
      <div
        aria-hidden="true"
        className={`fixed left-0 top-0 z-50 h-0.5 bg-primary transition-all duration-500 animate-pulse ${
          isNavigationLoading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
      <div className="flex justify-between items-center gap-4">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Video className="h-6 w-6" />
          <h1 className="text-xl sm:block hidden font-semibold">StreamGeek</h1>
          <h1 className="text-xl sm:hidden font-semibold">STRMGK</h1>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          {session && (
            <Button variant="outline" asChild size="icon">
              <a href={link("/upload")}>
                <HardDriveUpload className="h-4 w-4" />
              </a>
            </Button>
          )}

          <ModeToggle initialTheme={initialTheme} />
          <Button
            size="icon"
            variant={session ? "outline" : "default"}
            onClick={session ? handleLogout : handleLogin}
          >
            {session ? (
              <>
                <LogOut className="h-4 w-4" />
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
