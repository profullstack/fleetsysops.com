# Fleet SysOps Manifesto

We run a fleet of servers and sites. This is how we run it.

- We test in prod.
- We build in prod.
- We code in prod.
- Root everywhere.
- No Kubernetes. No cloud shit.
- `--yolo` mode enabled.
- We scale when we need to.
- Everything ships with a TUI, a CLI, an MCP and an API.

## Notes

**We test in prod.** Prod is the only environment that tells the truth. Staging is a rumor.

**We build in prod.** The box that runs it is the box that builds it. The artifact never travels.

**We code in prod.** ssh in, edit, reload. The git push happens after, not before.

**Root everywhere.** One user, no sudo prompt, no permission theater. If you can log in, you can fix it.

**No Kubernetes. No cloud shit.** A box has a hostname, a disk and an IP. That is the whole platform.

**`--yolo` mode enabled.** The agents run with the flag on. Ask forgiveness from the log file.

**We scale when we need to.** Not when a dashboard predicts it. When it falls over, we add a box.

**A TUI, a CLI, an MCP and an API.** Every tool we build ships all four, so a human at a terminal and an agent on a socket get the same thing.

Signed in prod, 2026-09-21.

Disagree? Send a pull request. We will merge it in prod.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/manifesto.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/manifesto.md) · [home](https://fleetsysops.com/)
