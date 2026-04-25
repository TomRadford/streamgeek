"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/web/components/ui/button";
import { setTheme } from "@/web/actions/set-theme";
import { type Theme } from "@/web/shared/theme";

export function ModeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const isInitialMount = useRef(true);

  const toggleTheme = () => {
    if (theme === "system") {
      setThemeState("light");
    } else if (theme === "light") {
      setThemeState("dark");
    } else {
      setThemeState("system");
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const shouldBeDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", shouldBeDark);
    root.setAttribute("data-theme", theme);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setTheme(theme).catch((error) => {
      console.error("Failed to set theme:", error);
    });
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const Icon = theme === "dark" ? Sun : theme === "light" ? Moon : Monitor;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Toggle theme. Current theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
