/**
 * fleetsysops.com: a site that is nothing but Markdown files.
 *
 * Every document is a `.md` file in this directory, served as text. `/` is `index.md`,
 * `/manifesto` is `manifesto.md`, and a missing page is `404.md` with a 404 status.
 * Browsers get the exact source in a `<pre>`, with every link clickable, because a
 * browser shows plain text as dead characters and the `html` link at the bottom of
 * each page has to be a link. Everything else (curl, agents, readm3.com fetching a
 * page to render it) gets raw `text/markdown`. `/<page>.html` redirects to the
 * readm3.com render. Every response allows any origin, which is what lets readm3.com
 * fetch the file.
 *
 * Nothing that is not a Markdown file is ever served.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize, relative, sep } from "node:path";

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

/** A browser announces text/html; everything else is a program that wants the Markdown. */
function isBrowser(request: Request): boolean {
  return (request.headers.get("accept") ?? "").includes("text/html");
}

function contentType(request: Request): string {
  return isBrowser(request) ? "text/html; charset=utf-8" : "text/markdown; charset=utf-8";
}

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * The browser view: the Markdown source, verbatim, in a <pre>, with Markdown links and
 * bare URLs wrapped in anchors so they can be clicked. Nothing is rendered; a reader
 * who wants rendering follows the html link.
 */
export function browserPage(source: string, name: string): string {
  const link = /\[([^\]\n]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)|https?:\/\/[^\s<>)"']+/g;
  let html = "";
  let last = 0;
  for (const match of source.matchAll(link)) {
    html += escape(source.slice(last, match.index));
    const href = match[2] ?? match[0];
    html += `<a href="${escape(href)}">${escape(match[0])}</a>`;
    last = match.index + match[0].length;
  }
  html += escape(source.slice(last));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(name)} · fleetsysops.com</title>
<style>
:root{color-scheme:light dark}
body{margin:0;background:#fff;color:#111}
pre{margin:0;padding:24px 16px;white-space:pre-wrap;overflow-wrap:anywhere;font:15px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;max-width:80ch}
a{color:inherit;text-decoration:underline;text-underline-offset:3px}
@media (prefers-color-scheme:dark){body{background:#0d1117;color:#e6edf3}}
</style></head><body><pre>${html}</pre></body></html>
`;
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

  if (url.pathname.endsWith(".html")) {
    const page = url.pathname.slice(0, -5);
    if (resolve(`${page}.md`)) return Response.redirect(`https://readm3.com/viewer?url=${SITE}${page}.md`, 302);
  }

  const file = resolve(url.pathname);
  if (file) return respond(request, readFileSync(file, "utf8"), 200, file);
  const missing = join(root, "404.md");
  return respond(request, existsSync(missing) ? readFileSync(missing, "utf8") : "not found\n", 404, missing, { "cache-control": "no-store" });
}

function respond(request: Request, source: string, status: number, file: string, extra: Record<string, string> = {}): Response {
  const body = isBrowser(request) ? browserPage(source, relative(root, file)) : source;
  return new Response(request.method === "HEAD" ? null : body, { status, headers: headers(request, extra) });
}

if (import.meta.main) {
  const server = Bun.serve({ port, hostname: "0.0.0.0", fetch: handle });
  console.log(`fleetsysops serving ${root} on http://${server.hostname}:${server.port}`);
}
