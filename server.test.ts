import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { handle, resolve, root, SITE } from "./server.ts";

const get = (path: string, init: RequestInit & { host?: string } = {}) => {
  const { host, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (host) headers.set("host", host);
  return handle(new Request(`https://fleetsysops.com${path}`, { ...rest, headers }));
};

describe("the Markdown server", () => {
  test("serves index.md at the root as text/markdown with CORS for every origin", async () => {
    const response = get("/");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await response.text()).toStartWith("# Fleet SysOps");
  });

  test("gives a browser text/plain so the source displays instead of downloading", async () => {
    const response = get("/manifesto.md", { headers: { accept: "text/html,application/xhtml+xml,*/*;q=0.8" } });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await response.text()).toContain("We test in prod.");
  });

  test("resolves an extensionless path to the .md file and strips a trailing slash", async () => {
    expect(await get("/manifesto").text()).toBe(await get("/manifesto.md").text());
    const slash = get("/manifesto/");
    expect(slash.status).toBe(308);
    expect(slash.headers.get("location")).toBe("https://fleetsysops.com/manifesto");
  });

  test("redirects www to the apex, keeping the path", () => {
    const response = get("/manifesto.md?x=1", { host: "www.fleetsysops.com" });
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`${SITE}/manifesto.md?x=1`);
  });

  test("answers a missing page with 404.md and a 404 status", async () => {
    const response = get("/nope");
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(await response.text()).toStartWith("# Not found");
  });

  test("never serves anything that is not a Markdown file", () => {
    for (const path of ["/server.ts", "/package.json", "/Dockerfile", "/.git/config", "/.github/workflows/ci.yml", "/../server.ts", "/%2e%2e/server.ts", "/server.ts%00.md"]) {
      expect(get(path).status).toBe(404);
    }
    expect(resolve("/../../etc/passwd")).toBeNull();
    expect(resolve("/.git/HEAD.md")).toBeNull();
  });

  test("answers preflight and refuses writes", () => {
    const preflight = handle(new Request("https://fleetsysops.com/manifesto.md", { method: "OPTIONS" }));
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("access-control-allow-methods")).toContain("GET");
    expect(handle(new Request("https://fleetsysops.com/manifesto.md", { method: "POST", body: "x" })).status).toBe(405);
    const head = handle(new Request("https://fleetsysops.com/manifesto.md", { method: "HEAD" }));
    expect(head.status).toBe(200);
  });
});

/** Every served document, relative to the repo root, skipping dot directories. */
function documents(dir = root): string[] {
  const found: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) found.push(...documents(path));
    else if (name.endsWith(".md")) found.push(relative(root, path));
  }
  return found.sort();
}

describe("every document", () => {
  const pages = documents();

  test("exists, and index.md and manifesto.md are among them", () => {
    expect(pages).toContain("index.md");
    expect(pages).toContain("manifesto.md");
  });

  test.each(pages)("%s ends with the html link that renders it on readm3.com", (page) => {
    const source = readFileSync(join(root, page), "utf8");
    const url = `${SITE}/${page}`;
    const lastLine = source.trimEnd().split("\n").at(-1) ?? "";
    expect(lastLine).toContain(`[html](https://readm3.com/viewer?url=${url})`);
    expect(lastLine).toContain("[home](https://fleetsysops.com/)");
  });

  test.each(pages)("%s has no em dash", (page) => {
    expect(readFileSync(join(root, page), "utf8")).not.toContain("—");
  });
});
