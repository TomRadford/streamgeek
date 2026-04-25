export type Theme = "dark" | "light" | "system";

export const DEFAULT_THEME: Theme = "system";

export const isTheme = (theme: string | undefined | null): theme is Theme =>
  theme === "dark" || theme === "light" || theme === "system";

export const parseThemeCookie = (cookie: string | null): Theme => {
  const match = cookie?.match(/(?:^|;\s*)theme=([^;]+)/);
  const theme = match?.[1] ? decodeURIComponent(match[1]) : null;

  return isTheme(theme) ? theme : DEFAULT_THEME;
};
