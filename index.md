# Fleet SysOps

Documents for people who run a fleet of boxes by hand, and like it.

## Documents

- [Fleet SysOps Manifesto](https://fleetsysops.com/manifesto.md)

More documents land here as they get written.

## How this site works

Every page is a Markdown file and nothing else. No HTML, no JavaScript, no build step.

Read it here as text, fetch it with curl, pipe it through readm3, or click **html** at the bottom of any page to render it with readm3.com.

    curl https://fleetsysops.com/manifesto.md
    curl -s https://fleetsysops.com/manifesto.md | npx @profullstack/readm3 --print

Every page is served with `Access-Control-Allow-Origin: *`, so any reader on any origin can fetch it.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/index.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/index.md) · [home](https://fleetsysops.com/)
