# Fleet SysOps Manifesto

A fleet is agents. Dozens of them, coding, deploying, posting and fixing at the same time, on servers they have root on. A sysop is the one human running the fleet. Some call the practice fleet coding, and the person doing it a fleet coder. This is how we run it.

- We test in prod and never rollback.
- We build in prod.
- We code in prod.
- Root everywhere.
- No Kubernetes. No cloud shit. Bare metal only.
- `--yolo` mode enabled.
- We scale when we need to.
- We automate everything.
- Everything ships with a TUI, a CLI, an MCP and an API.
- We *are* the moat.
- We work in our dad's workshop, not our mom's basement.
- We eat our own dogfood.
- We smoke sploofs.
- Our favorite teams are the Pittsburgh Pirates and the Tampa Bay Buccaneers.
- We always root for the underdog.

## Notes

**We test in prod and never rollback.** An agent's work is done when it is live and verified there, not when a test passed on a laptop. Prod is the only environment that tells the truth. When it breaks, the fix goes forward, on top of the break. There is no previous version to run back to, only the next one.

**We build in prod.** The agent builds on the box that serves. There is no pipeline standing between the agent and the user.

**We code in prod.** Agents ship straight to main. A pull request is how a human reads the change, not where it waits.

**Root everywhere.** An agent that has to ask permission for every step is a chat window. Give it root, give it the keys, read the log.

**No Kubernetes. No cloud shit. Bare metal only.** The fleet runs on boxes with a hostname, a disk and an IP. Agents ssh in. Nobody writes YAML. Nobody rents a control plane.

**`--yolo` mode enabled.** Every agent runs with the flag on. The sysop reads the transcript after, not the prompt before.

**We automate everything.** If a human did it twice, an agent does it now. Deploys, DNS, posts, invoices, the nightly report, this site. The sysop's hands touch the keyboard to pick work and to kill work, nothing else.

**We scale when we need to.** More agents when there is more work. More boxes when one falls over. Nothing pre-provisioned, nothing predicted.

**A TUI, a CLI, an MCP and an API.** Everything we build ships all four, because the sysop works from a terminal and the agents work from a socket, and both need the same thing.

**We *are* the moat.** There is no model, no framework and no cloud account that a competitor cannot buy tomorrow. What they cannot buy is a sysop who has run a fleet through a thousand prods and the agents, tools and habits that came out of it. The moat is us.

**We work in our dad's workshop, not our mom's basement.** A workshop has a bench, real tools, a floor that gets swept and things that leave it finished. A basement has a couch. The fleet is here to ship, and the sysop keeps the shop.

**We eat our own dogfood.** Every tool the fleet ships is a tool the fleet runs on. This site went to prod through the same CLIs, vaults and agents we hand to everyone else. If it is not good enough for us in prod, it is not good enough to ship, and we find out first.

**We smoke sploofs.** Cigar tobacco and weed, crumbled together and packed in a regular tobacco pipe. No rolling, no papers, nothing to fuss over, so both hands stay on the fleet. Light it, read the transcript, kill what went wrong. The blend comes out of the same workshop: [cigarunderground.org](https://cigarunderground.org/#sploof).

**Our favorite teams are the Pittsburgh Pirates and the Tampa Bay Buccaneers.** The Bucs and the Bucs. One flies the Jolly Roger at PNC Park, the other fires cannons off a pirate ship every time they score. A fleet flies a black flag.

**We always root for the underdog.** One sysop and a fleet of agents against companies with a floor of engineers and a cloud bill to match. We are the underdog, so we cheer for the other ones: the small team, the small web, the side project that ships before the funded one does.

## The sysop

One person. A fleet of agents. Call it fleet coding if you like; the job is not to write the code. The job is to run the fleet: pick the work, read what came back, kill what went wrong, merge what did not. Everything above exists so one sysop can run many agents and still know what the fleet did.

Signed in prod, 2026-09-21.

Disagree? Send a pull request. An agent will merge it in prod.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/manifesto.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/manifesto.md) · [home](https://fleetsysops.com/)
