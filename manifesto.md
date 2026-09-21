# Fleet SysOps Manifesto

A fleet is agents. Dozens of them, coding, deploying, posting and fixing at the same time, on servers they have root on. A sysop is the one human running the fleet. Some call the practice fleet coding, and the person doing it a fleet coder. This is how we run it.

- We test in prod.
- We build in prod.
- We code in prod.
- Root everywhere.
- No Kubernetes. No cloud shit.
- `--yolo` mode enabled.
- We scale when we need to.
- Everything ships with a TUI, a CLI, an MCP and an API.
- We *are* the moat.

## Notes

**We test in prod.** An agent's work is done when it is live and verified there, not when a test passed on a laptop. Prod is the only environment that tells the truth.

**We build in prod.** The agent builds on the box that serves. There is no pipeline standing between the agent and the user.

**We code in prod.** Agents ship straight to main. A pull request is how a human reads the change, not where it waits.

**Root everywhere.** An agent that has to ask permission for every step is a chat window. Give it root, give it the keys, read the log.

**No Kubernetes. No cloud shit.** The fleet runs on boxes with a hostname, a disk and an IP. Agents ssh in. Nobody writes YAML.

**`--yolo` mode enabled.** Every agent runs with the flag on. The sysop reads the transcript after, not the prompt before.

**We scale when we need to.** More agents when there is more work. More boxes when one falls over. Nothing pre-provisioned, nothing predicted.

**A TUI, a CLI, an MCP and an API.** Everything we build ships all four, because the sysop works from a terminal and the agents work from a socket, and both need the same thing.

**We *are* the moat.** There is no model, no framework and no cloud account that a competitor cannot buy tomorrow. What they cannot buy is a sysop who has run a fleet through a thousand prods and the agents, tools and habits that came out of it. The moat is us.

## The sysop

One person. A fleet of agents. Call it fleet coding if you like; the job is not to write the code. The job is to run the fleet: pick the work, read what came back, kill what went wrong, merge what did not. Everything above exists so one sysop can run many agents and still know what the fleet did.

Signed in prod, 2026-09-21.

Disagree? Send a pull request. An agent will merge it in prod.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/manifesto.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/manifesto.md) · [home](https://fleetsysops.com/)
