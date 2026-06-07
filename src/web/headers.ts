import { env } from "cloudflare:workers";
import { RouteMiddleware } from "rwsdk/router";

export const setCommonHeaders =
  (): RouteMiddleware =>
  ({ request, response, rw: { nonce } }) => {
    const pathname = new URL(request.url).pathname;

    if (!import.meta.env.VITE_IS_DEV_SERVER) {
      // Forces browsers to always use HTTPS for a specified time period (2 years)
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload",
      );
    }

    // Forces browser to use the declared content-type instead of trying to guess/sniff it
    response.headers.set("X-Content-Type-Options", "nosniff");

    // Stops browsers from sending the referring webpage URL in HTTP headers
    response.headers.set("Referrer-Policy", "no-referrer");

    // Explicitly disables access to specific browser features/APIs
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()",
    );

    // Defines trusted sources for content loading and script execution:
    const s3UrlWithTrailingSlash = env.S3_PUBLIC_ACCESS.endsWith("/")
      ? env.S3_PUBLIC_ACCESS
      : `${env.S3_PUBLIC_ACCESS}/`;

    if (pathname.startsWith("/embed/")) {
      response.headers.set("X-Embed-Route", "1");
    }

    response.headers.set(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *; frame-src https://challenges.cloudflare.com; connect-src 'self' *; media-src 'self' blob: data: ${s3UrlWithTrailingSlash}; object-src 'none';`,
    );
  };
