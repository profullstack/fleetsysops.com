# fleetsysops.com

The [Fleet SysOps Manifesto](https://fleetsysops.com/manifesto.md), for the one human running a fleet of coding agents, and the documents that follow it, served as nothing but Markdown.

Every page on the site is a `.md` file in the root of this repository. There is no HTML, no JavaScript, no build. `server.ts` hands the files out as text and that is the whole site.

## How a page is served

- `/` is `index.md`. `/manifesto` and `/manifesto.md` are both `manifesto.md`. A missing page is `404.md` with a 404 status.
- A browser (anything that sends `Accept: text/html`) gets `text/plain`, so the source displays inline instead of downloading. Everything else gets `text/markdown`.
- Every response carries `Access-Control-Allow-Origin: *`, so a reader on any origin can fetch a page. That is what the **html** link at the bottom of each page relies on: it hands the file to [readm3.com](https://readm3.com), which renders it in the browser.
- Only `.md` files are served. Dotfiles, the server, this README's neighbours in `.github`: none of it is reachable.
- `www.` redirects to the apex.

## Adding a document

1. Create `name.md` in the repository root (or in a folder; `docs/name.md` is served at `/docs/name.md`).
2. End it with the footer line every page carries, pointing at its own URL:

       [html](https://readm3.com/viewer?url=https://fleetsysops.com/name.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/name.md) · [home](https://fleetsysops.com/)

3. Link it from `index.md`.
4. Push to `main`. Railway builds the Dockerfile and deploys within a minute.

`bun test` checks that every page ends with its own html link and contains no em dash, along with the server's behaviour.

## Running it

    bun server.ts          # http://localhost:3000
    bun test

`PORT` and `SITE_URL` (default `https://fleetsysops.com`) are the only settings.

## Reading it

    curl https://fleetsysops.com/manifesto.md
    curl -s https://fleetsysops.com/manifesto.md | npx @profullstack/readm3 --print

## License

MIT for the code. The documents are ours; quote them, fork them, send a pull request.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/README.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/README.md) · [home](https://fleetsysops.com/)
