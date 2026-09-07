// Public origin used for canonical links, OpenGraph and any absolute URL in
// metadata.
//
// NEXT_PUBLIC_SITE_URL wins when set — it's the only way to name a custom
// domain. Otherwise fall back to VERCEL_URL, which Vercel injects at build time
// as a bare host (no scheme) for the deployment being built, so a deploy with
// no env configured still emits its own origin instead of localhost.

function normalize(value: string): string {
  const withScheme = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalize(explicit);

  // Set by Vercel on every deployment; NEXT_PUBLIC_ prefix for the client.
  const vercel =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (vercel) return normalize(vercel);

  return "http://localhost:3000";
}

export const siteUrl = resolve();
