import { requestInfo } from "rwsdk/worker";
import styles from "./styles.css?url";
import { DEFAULT_THEME, isTheme } from "@/web/shared/theme";

const themeScript = `
(() => {
  const theme = document.documentElement.dataset.theme;
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && isSystemDark);

  document.documentElement.classList.toggle("dark", shouldBeDark);
})();
`;

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = isTheme(requestInfo?.ctx?.theme)
    ? requestInfo.ctx.theme
    : DEFAULT_THEME;

  return (
    <html
      lang="en"
      className={theme === "dark" ? "dark" : undefined}
      data-theme={theme}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="modulepreload" href="/src/client.tsx" />
        <link rel="stylesheet" href={styles} />
      </head>
      <body>
        <div id="root">{children}</div>
        <script>import("/src/client.tsx")</script>
      </body>
    </html>
  );
};
