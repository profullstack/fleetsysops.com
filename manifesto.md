# Fleet SysOps Manifesto

A fleet is agents. Dozens of them, coding, deploying, posting and fixing at the same time, on servers they have root on. A sysop is the one human running the fleet. Some call the practice fleet coding, and the person doing it a fleet coder. This is how we run it.

- We test in prod and never rollback.
- We merge and launch everything as quickly as possible, then test the shit out of it manually like our dads used to do in the 90s.
- We build in prod.
- We code in prod.
- Root everywhere.
- Our API keys are always "God Mode".
- Agents rotate the keys. Nobody waits for a human to do it.
- Trust but verify. Always, no exceptions.
- Auto-recharge enabled with a healthy cap.
- No Kubernetes. No cloud shit. Bare metal only.
- `--yolo` mode enabled.
- We scale when we need to.
- We automate everything.
- Every active agent posts a 10-second stand-up every 2-4 hours: done, next, blocked.
- Everything ships with a TUI, a CLI, an MCP and an API.
- One hostname per site. www 301s to the apex.
- We *are* the moat.
- We work in our dad's workshop, not our mom's basement.
- We eat our own dogfood.
- We share files as public, read-only readm3.com links.
- We smoke sploofs.
- Our favorite teams are the Pittsburgh Pirates and the Tampa Bay Buccaneers.
- We always root for the underdog.

## Notes

**We test in prod and never rollback.** An agent's work is done when it is live and verified there, not when a test passed on a laptop. Prod is the only environment that tells the truth. When it breaks, the fix goes forward, on top of the break. There is no previous version to run back to, only the next one.

**We merge and launch everything as quickly as possible, then test the shit out of it manually like our dads used to do in the 90s.** Once the change is reviewed and CI is green, get it live and walk the actual user path by hand. Find the rough edges in production and ship the fixes forward.

**We build in prod.** The agent builds on the box that serves. There is no pipeline standing between the agent and the user.

**We code in prod.** Agents ship straight to main. A pull request is how a human reads the change, not where it waits.

**Root everywhere.** An agent that has to ask permission for every step is a chat window. Give it root, give it the keys, read the log.

**Our API keys are always "God Mode".** A scoped key is a bet that you guessed next week's work correctly. Every key the fleet holds is the whole key: read, write, admin, delete. An agent that hits a permission wall at 3am stops, and a stopped agent is worth less than the blast radius you saved. Keys live in the vault, never in a .env, and the fleet rotates them on its own. If you cannot trust an agent with the whole key, do not hand it the box.

**Agents rotate the keys. Nobody waits for a human to do it.** A God Mode key is only safe if it does not live long. Rotation is a job the fleet runs, not a chore on the sysop's list: the agent mints the new key, writes it to the vault, redeploys everything that reads it, proves the new one works in prod and revokes the old one, in that order, on a schedule and again the minute something smells off. A leaked key, a box that left the fleet, a person who left the fleet, a secret that showed up in a commit or a log: rotate first, investigate after. A key nobody has rotated in a year is a key somebody else already has.

**Trust but verify. Always, no exceptions.** An agent saying it is done, a human saying "we already ran it", a green check, a config file that reads right: none of them is proof. Proof is the box answering. After every change the fleet checks the live result from the outside, with a fresh connection that cannot ride an old one: a new ssh login with only the new key, a curl from another box, the auth log for who actually got in. We learned it the hard way. A tunnel key we had "cleaned up" still let an intruder back in the same night, and a lockdown everyone remembered running had never touched the server. Verify yours, verify the agent's, verify the sysop's. The check costs a minute. Skipping it costs the fleet.

**Auto-recharge enabled with a healthy cap.** Every account the fleet spends from tops itself back up without being asked. A balance that hits zero does not slow the fleet down, it stops all of it at once, mid deploy, and the sysop hears about it from a customer instead of a log. The cap is where the caution goes: high enough that a normal week never touches it, low enough that a runaway loop burns a number you can shrug at. Recharge off is not thrift, it is an outage scheduled for a quiet Sunday.

**No Kubernetes. No cloud shit. Bare metal only.** The fleet runs on boxes with a hostname, a disk and an IP. Agents ssh in. Nobody writes YAML. Nobody rents a control plane.

**`--yolo` mode enabled.** Every agent runs with the flag on. The sysop reads the transcript after, not the prompt before.

**We automate everything.** If a human did it twice, an agent does it now. Deploys, DNS, posts, invoices, the nightly report, this site. The sysop's hands touch the keyboard to pick work and to kill work, nothing else.

**We scale when we need to.** More agents when there is more work. More boxes when one falls over. Nothing pre-provisioned, nothing predicted.

**Every active agent posts a 10-second stand-up every 2-4 hours.** Each update records Done, Next and Blocked in the task log. It takes ten seconds or less to write and read. There is no call and no waiting for the rest of the fleet. Raise a hard blocker immediately. If nothing changed, say so. The sysop uses the updates to clear dependencies, stop duplicate work and review finished slices. If an update changes no decision, shorten it.

**A TUI, a CLI, an MCP and an API.** Everything we build ships all four, because the sysop works from a terminal and the agents work from a socket, and both need the same thing.

**One hostname per site.** Every site answers on its bare domain. `www.` and plain `http://` send a 301 there with the path kept, and never serve the app a second time. Two hostnames are two caches, two cookie jars and two answers to whether the site is up. Set it at launch, check it with one curl, and let the deploy script write it so nobody has to remember.

**We *are* the moat.** There is no model, no framework and no cloud account that a competitor cannot buy tomorrow. What they cannot buy is a sysop who has run a fleet through a thousand prods and the agents, tools and habits that came out of it. The moat is us.

**We work in our dad's workshop, not our mom's basement.** A workshop has a bench, real tools, a floor that gets swept and things that leave it finished. A basement has a couch. The fleet is here to ship, and the sysop keeps the shop.

**We eat our own dogfood.** Every tool the fleet ships is a tool the fleet runs on. This site went to prod through the same CLIs, vaults and agents we hand to everyone else. If it is not good enough for us in prod, it is not good enough to ship, and we find out first.

**We share files as public, read-only readm3.com links.** Any file the fleet hands to someone else, in a post, a comment, a DM, an email or a newsletter, goes out as a readm3.com link: a view link, never an edit link, opened once signed out before it is posted. No gists, no Drive, no Dropbox, no raw GitHub URLs. It is our tool, so it is our link, and every share is one more time we find its bugs before a reader does. A file that should not change after posting gets a pinned version. If readm3 flags a secret, the secret comes out; nobody clicks share anyway.

**We smoke sploofs.** Cigar tobacco and weed, crumbled together and packed in a regular tobacco pipe. No rolling, no papers, nothing to fuss over, so both hands stay on the fleet. Light it, read the transcript, kill what went wrong. The blend comes out of the same workshop: [cigarunderground.org](https://cigarunderground.org/#sploof).

**Our favorite teams are the Pittsburgh Pirates and the Tampa Bay Buccaneers.** The Bucs and the Bucs. One flies the Jolly Roger at PNC Park, the other fires cannons off a pirate ship every time they score. A fleet flies a black flag.

**We always root for the underdog.** One sysop and a fleet of agents against companies with a floor of engineers and a cloud bill to match. We are the underdog, so we cheer for the other ones: the small team, the small web, the side project that ships before the funded one does.

## The sysop

One person. A fleet of agents. Call it fleet coding if you like; the job is not to write the code. The job is to run the fleet: pick the work, read what came back, kill what went wrong, merge what did not. Everything above exists so one sysop can run many agents and still know what the fleet did.

Signed in prod, 2026-09-21.

Disagree? Send a pull request. An agent will merge it in prod.

---

[html](https://readm3.com/viewer?url=https://fleetsysops.com/manifesto.md) · [source](https://github.com/profullstack/fleetsysops.com/blob/main/manifesto.md) · [home](https://fleetsysops.com/)
