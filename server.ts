/**
 * fleetsysops.com: a site that is nothing but Markdown files.
 *
 * Every document is a `.md` file in this directory, served as text. `/` is `index.md`,
 * `/manifesto` is `manifesto.md`, and a missing page is `404.md` with a 404 status.
 * Browsers get `text/plain` so they show the source instead of offering a download;
 * everything else (curl, agents, readm3.com fetching a page to render it) gets
 * `text/markdown`. Every response allows any origin, which is what lets the `html`
 * link at the bottom of each page hand the file to readm3.com.
 *
 * Nothing that is not a Markdown file is ever served.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize, sep } from "node:path";

export const root = import.meta.dir;
export const SITE = (process.env.SITE_URL ?? "https://fleetsysops.com").replace(/\/$/, "");
const port = Number(process.env.PORT ?? 3000);

/** The file behind a request path, or null when it escapes the root or is not a Markdown file. */
export function resolve(pathname: string): string | null {
  let decoded: string;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
  if (clean.split(/[/\\]/).some((part) => part.startsWith("."))) return null;
  const base = join(root, clean);
  const candidates = clean === "" ? [join(root, "index.md")]
    : clean.endsWith(".md") ? [base]
    : [`${base}.md`, join(base, "index.md")];
  for (const candidate of candidates) {
    if (!candidate.startsWith(root + sep) || !candidate.endsWith(".md")) continue;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Browsers announce text/html; they get plain text so the Markdown displays inline. */
function contentType(request: Request): string {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html") ? "text/plain; charset=utf-8" : "text/markdown; charset=utf-8";
}

function headers(request: Request, extra: Record<string, string> = {}): Headers {
  return new Headers({
    "content-type": contentType(request),
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, HEAD, OPTIONS",
    "access-control-allow-headers": "*",
    "x-content-type-options": "nosniff",
    "cache-control": "public, max-age=60, must-revalidate",
    ...extra,
  });
}

export function handle(request: Request): Response {
  const url = new URL(request.url);
  const host = (request.headers.get("host") ?? url.host).toLowerCase();
  const site = new URL(SITE);

  if (host === `www.${site.host}`) {
    return Response.redirect(`${SITE}${url.pathname}${url.search}`, 308);
  }
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(request) });
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("method not allowed\n", { status: 405, headers: headers(request, { allow: "GET, HEAD, OPTIONS" }) });
  }
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    return Response.redirect(`${url.origin}${url.pathname.replace(/\/+$/, "")}${url.search}`, 308);
  }

  const file = resolve(url.pathname);
  if (file) {
    const body = request.method === "HEAD" ? null : readFileSync(file);
    return new Response(body, { status: 200, headers: headers(request) });
  }
  const missing = join(root, "404.md");
  const body = existsSync(missing) ? readFileSync(missing) : "not found\n";
  return new Response(request.method === "HEAD" ? null : body, { status: 404, headers: headers(request, { "cache-control": "no-store" }) });
}

if (import.meta.main) {
  const server = Bun.serve({ port, hostname: "0.0.0.0", fetch: handle });
  console.log(`fleetsysops serving ${root} on http://${server.hostname}:${server.port}`);
}
