# Fleet SysOps

Documents for the sysop: the one human running a fleet of coding agents, and the servers they run on. Also known as fleet coding.

## Documents

- [Fleet SysOps Manifesto](https://fleetsysops.com/manifesto.md)

More documents land here as they get written.

## How this site works

Every page is a Markdown file and nothing else. No HTML, no JavaScript, no build step.

In a browser you see the source as written, links included. Fetch it with curl, pipe it through readm3, or click **html** at the bottom of any page to render it with readm3.com. Swapping `.md` for `.html` in the address does the same.

    curl https://fleetsysops.com/manifesto.md
    curl -s https://fleetsysops.com/manifesto.md | npx @profullstack/readm3 --print

Every page is served with `Access-Control-Allow-Origin: *`, so any reader on any origin can fetch it.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/index.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/index.md) · [home](https://fleetsysops.com/)
