# TL;DR options: recall post

<!-- Draft for review. Alternatives to the TL;DR callout in
src/content/posts/recall-how-my-ai-agent-finds-authenticates-and-connects.mdx.
Pick one (or mix) and paste it into the <Callout title="TL;DR"> block. -->

## Current (for comparison)

I built a small local tool, recall, so the AI agent I use for ops work can search years of my notes, use my credentials without ever seeing a value, and know how to reach every cluster, host and account I work with. One process, exposed as a CLI and an MCP server, fed by plain files. Search was the easy part. The pieces that changed how the agent behaves are a vault that hands out commands instead of values, an inventory that knows what needs the VPN, and a read-only check that says what has expired. The repository stays private; the design is here to copy.

## A. Problem first

My AI agent was good at ops work and bad at three things around it: it forgot what I wrote last year, it needed me to hand over credentials, and it had no idea how to reach anything. Recall closes those gaps. It is one local process, a CLI and an MCP server over plain files, that gives the agent hybrid search over my notes, a vault that runs commands with secrets injected but never returns a value, and an inventory of how to reach every cluster, host and account, including which ones need the VPN. The code stays private; the design is here to copy.

## B. The rule up front

The agent may use a secret, never see it. That one rule shaped recall, a small local tool that lets my ops agent search years of notes, authenticate by running commands with credentials injected and output masked, and reach any cluster, host or account from a plain inventory file. Hybrid search was the easy part. What changed the agent's behaviour was the vault, a VPN check that stops it treating a 403 as a bad token, and a read-only sweep that says what has expired. Private repository, public design.

## C. Short (chosen)

Recall is a small local tool that gives my AI agent what it was missing: memory of my notes, credentials it can use, and a map of how to reach every system I work with. This post walks through the design, so you can build your own.

Other endings for the last sentence:

1. The code is tied to my setup, but the design is all here, enough to build your own in a few days. 
2. This post walks through the design, so you can build your own. (used above)
3. Below is how it works, what surprised me, and what I would keep if I built it again.
4. I am not sharing the code, only the design and the lessons, which are the parts worth copying.

## D. Bullets

A small local tool, recall, so the AI agent I use for ops work can:

- **Find** what I wrote before: keyword and vector search over 596 files of notes and runbooks, fused into one ranked list.
- **Authenticate** without seeing a value: the vault returns a command or runs it with the secret injected, and masks the output.
- **Connect** to any cluster, host or account: an inventory of access steps, with a VPN check that fails fast instead of looking like a revoked token.
- **Verify** what still works: a read-only sweep that reports what has expired, what is unreachable and why.

One process, plain YAML and markdown in, one SQLite database in the middle. The code stays private; the design is here to copy.

## E. Lesson first

Small tools built for the agent, around my own way of working, have improved its output more than any prompt or model upgrade. Recall is one of them: a local CLI and MCP server that lets my ops agent search my notes, use credentials without ever holding the value, and look up how to reach every cluster, host and account before it touches one. Search was the easy part; deciding what the agent may know, use and never see, and making the tool enforce it, was the work. The design is here; the repository stays private.

## Notes

- A and B are the closest in length to the current one (about 90 words). C is about 50.
- D works best if the callout renders markdown lists well; check before using it.
- B and E reuse lines from the body (the secret rule, the closing line). That makes the TL;DR echo the post, but the repetition may feel heavy on a full read.
