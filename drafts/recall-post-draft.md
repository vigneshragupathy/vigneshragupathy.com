# Recall: how my AI agent finds, authenticates and connects

<!-- Draft for review. Prose only; [diagram], [chart] and [stats] marks show where the visuals go in the MDX version. -->

**TL;DR**: I built a small local tool, recall, so the AI agent I use for ops work can search years of my notes, use my credentials without ever seeing a value, and know how to reach every cluster, host and account I work with. One process, exposed as a CLI and an MCP server, fed by plain files. Search was the easy part. The pieces that changed how the agent behaves are a vault that hands out commands instead of values, an inventory that knows what needs the VPN, and a read-only check that says what has expired. The repository stays private; the design is here to copy.

I use an AI agent in the terminal for most of my ops related work. Writing code is only part of it. The same agent digs through old incidents to find a root cause, checks a cluster, fixes a broken deployment, drafts the ticket afterwards. It is good at the work itself, and surprisingly weak at a few things that have nothing to do with the work.

What I have learned over the past year is that small tools built for the agent, around my own way of working, improve its output more than any prompt or model upgrade. An agent with the right tool answers in one step; without it, it guesses, asks, or wanders. This post is about one such tool.

The gaps were easy to name. The agent does not remember what I wrote last year. My incident write-ups, runbooks and project notes are hundreds of markdown files, some on this machine and some on a remote, and to find one the agent has to search all of them every time, or ask me. When it needs a credential, I had to hand it over myself, either by pointing it at a file that holds the value or, worse, by pasting it into the session, where it stays in the transcript for good. And it has no idea how to reach anything: which script sets up the production account, which context the ops cluster uses, whether a host is only reachable over the VPN. I was typing the same instructions into every session.

Over a few days I built a small tool, recall, to close those gaps. This post is about the shape of it, what worked, and what surprised me along the way. It is a personal tool, so the design leans on that: one user, one machine, and files I already edit by hand.

I am not publishing the repository. It is tied to my notes, my accounts and my habits, and most of it would need rewriting to be useful to anyone else. The design is the transferable part, and there is enough of it here to think it through and build your own in a few days with an agent at your side.

[stats: 596 files indexed · 7,950 chunks · ₹0 embedding cost (6.7M tokens inside the free tier) · 93 inventory entries]

## The shape of it

The three needs are different in kind, but they come up together. "How do I connect to the ops cluster" needs the inventory for the steps, the vault for the credential those steps use, and the notes for the time it broke last spring. If those lived in separate tools, the agent would have to join them itself, and it would not.

So all of it sits behind one process with a command line and an MCP server. The MCP side is what the agent calls. The CLI is the same code, for me. The inputs are plain files I own: my notes tree, a couple of code repositories, YAML files for secrets and YAML files for inventory. Everything derived from them lives in a single SQLite database that can be rebuilt at any time.

[diagram: architecture. Inputs on the left (notes, code repos, secrets.yaml, inventory.yaml), recall in the middle (index, vault, inventory + verify), the agent and me on the right. Embedding API below, used only at index time.]

## Finding what I wrote before

Operations notes are a strange corpus. Half the questions are exact identifiers: a ticket key, a hostname, an account id. The other half are narrative: "how did we fix the certificate rotation". Keyword search is unbeatable for the first kind and poor at the second. Vector search is the reverse.

The index keeps both. Every chunk goes into a full-text table and a vector table in the same database. A query runs against both, the two ranked lists are merged with reciprocal rank fusion, a small recency prior nudges newer notes up, and at most two chunks per file survive so one long document cannot fill the page. An optional reranker can reorder the top results.

[diagram: flow. query → BM25 top 50 / vector top 50 → fuse → recency → collapse per file → rerank]

Two details mattered more than the fancy parts.

Chunks follow headings, not token counts. A runbook section is the unit someone wants back, not an arbitrary 500-token window. Each chunk carries its heading breadcrumb, and that breadcrumb is prepended to the text before embedding, so a "Rollback" section inside "Database upgrade 2025" embeds as what it is.

Identifiers skip the vector path entirely. If the query looks like a ticket key, a hostname or a UUID, only keyword search runs. There is no semantic neighbourhood for `INC-10963`; there is one exact answer.

[chart: mean reciprocal rank on 18 golden queries. keyword only 0.94 · vector only 0.89 · hybrid 0.95 · hybrid + rerank 0.92]

The benchmark is tiny and leans toward identifier queries, which is why keyword search alone looks so strong. Hybrid wins where it should, on the narrative questions, and never loses the exact-match ones. The reranker did not pay for itself on this set, so it stays off by default.

The vectors come from Voyage AI's `voyage-4`. I picked it because a whole runbook section fits in one embedding, it treats queries and documents differently, and a reranker from the same vendor plugs in with no second account. The full index came to 6.7 million tokens and cost nothing, well inside the free allowance. Embedding runs in small batches with a commit after each one, so a failure never loses progress, and a hard cap on billed tokens lives in the database so a bug can never spend money while I sleep. Only the index step talks to the API; search sends one short query at a time.

## Authenticating without seeing the secret

This was the constraint I cared most about. The agent has to authenticate, and it must never hold the value. The whole design follows one rule: a secret tool returns a command, or runs a command with the value injected into its environment. It never returns the value.

I did look at the usual answers first. A password manager CLI gives the agent the value, which is the one thing I wanted to avoid. A full secrets server is a lot of machinery for one person, and still ends with a token in the agent's hands. What I actually needed was narrow: a place to keep credentials that an agent can search by description, and a way to run a command with one of them without ever seeing it. That is small enough to build, and building it meant the rules could be enforced in code rather than in instructions. The vault's internals, how values are stored, how the parts of a multi-value secret are handled, how access is logged, deserve their own post, and I will write that separately.

Secrets live in plain YAML files that I edit by hand, one file today and a few, split by service, as the set grows. Each entry has an id, the service it belongs to, the environment, a username, an example of how to use it, free-text notes, and the value. A sync command encrypts the values into the database and indexes only the metadata. The agent can search for "token for Jira" and find the right id without the value ever being embedded or sent anywhere.

An entry looks like this:

```yaml
- id: jira-api-token
  service: jira
  environment: prod
  kind: token
  username: me@example.com
  url: https://jira.example.com
  tags: [atlassian, jira, api, rotate-yearly]
  notes: >
    Personal Jira bearer token. Used by the Jira integration and for ad-hoc
    API calls; default project OPS. Rotate yearly from the Jira profile page.
  use: 'curl -s -H "Authorization: Bearer $JIRA_API_TOKEN" https://jira.example.com/rest/api/2/myself'
  value: <the token>
```

Everything above `value` is searchable and is what the agent sees. The `use` line matters more than it looks: it tells the agent the calling convention, so it never has to guess whether this is a bearer token, basic auth or a header with a custom name.

[diagram: sequence. Agent asks recall to find a secret and gets back an id and the env var name. Agent asks recall to run a command with that id. recall decrypts, injects the value into a child process, the child calls the service, and recall returns the output with the value masked. A dashed boundary around recall, child and service: the value exists only there.]

From the agent's side it looks like this. It asks for a command, receives one line, and runs that line in its own shell:

```bash
recall secret exec jira-api-token -- curl -s -H "Authorization: Bearer $JIRA_API_TOKEN" https://jira.example.com/rest/api/2/myself
```

The value is decrypted inside the recall process, placed in the environment of the child, and every byte of the child's output is masked before it is returned. Passwords that must go to a prompt, like sudo on a VM, are written to the child's stdin instead. A plain `recall secret get` exists for me, and it refuses to print unless it is attached to a real terminal.

Two smaller choices paid off. Metadata is what makes a secret findable: good notes, tags and an example usage line do more for the agent than any clever retrieval. "Rotate yearly, used by the Jira integration, default project OPS" is the difference between a hit and a miss. And every access is logged, with who asked, which id, and the command that ran.

## Connecting to clusters, hosts and accounts

The third input is an inventory, and the word needs qualifying. This is not a CMDB or an asset database, and it does not try to list what exists. It is a plain file that answers one question for each thing I reach regularly: how do I get there from this machine. The same shape works for a VM behind a jump host, a production Kubernetes cluster, a cloud account that needs an SSO profile, or an internal web service with its own token.

One entry per cluster, host, cloud account, subscription or internal service, each with aliases, ordered access steps, one command that proves access works, and the ids of the secrets those steps need. No credentials in it, only references.

Two entries, a production cluster and the VM everything else is reached through:

```yaml
- id: ops-cluster
  kind: cluster
  name: ops-cluster
  aliases: [ops, platform cluster, ops-cluster-prod]
  environment: prod
  cloud: aws
  account: aws-ops-prod          # another inventory entry
  region: us-east-2
  requires: [vpn]                # checked before any step runs
  tags: [eks, kubernetes, critical]
  notes: >
    Platform cluster: ArgoCD, monitoring, the internal AI console.
    Context is created by the kubeconfig script from the infra repo.
  access:
  - source ~/utils/set_aws_ops_prod.sh            # SSO profile + temp creds
  - kubectl --context ops-cluster get nodes
  verify: kubectl --context ops-cluster get nodes
  secrets: []                                     # SSO covers it

- id: jump-host
  kind: host
  name: jump01.example.com
  aliases: [jump, bastion]
  environment: prod
  requires: [vpn]
  tags: [ssh, linux, critical]
  notes: >
    SSH jump host for every VM. ProxyJump is configured in ~/.ssh/config,
    so `ssh <any-vm>` routes through it automatically.
  access:
  - ssh jump01.example.com
  - 'sudo on any VM: recall secret exec vm-sudo -- ssh -t <host> sudo -S -k -p "" <command>'
  verify: ssh jump01.example.com hostname
  secrets: [vm-sudo]                              # id from secrets.yaml, injected on exec
```

`requires` points at another entry whose own proof command must pass first. `secrets` holds ids only; the values stay in the vault and are injected when the entry is executed.

The agent searches it the same way it searches notes. When a query names something in the inventory, the matching entry is pinned to the top of the results as an access block:

```text
Access: ops-cluster (cluster · prod)
  requires: vpn
  1. source ~/utils/set_aws_ops_prod.sh
  2. kubectl --context ops-cluster get nodes
  verify: kubectl --context ops-cluster get nodes
```

More useful than showing the steps is running them. `recall access exec ops-cluster -- kubectl get pods` sources the right environment, injects any linked secrets, runs the command and masks the output, all in one shell. The agent no longer reconstructs `source` lines or reads my kubeconfig.

### When the VPN is down

The first real sweep of the inventory taught me something I knew but had never written down. With the VPN disconnected, most internal services do not time out. They answer 403. To an agent, a 403 looks like a revoked token, and it will happily start "fixing" credentials.

Entries can now declare what they depend on. Almost every cluster, VM and internal UI carries `requires: [vpn]`, and `vpn` is itself an inventory entry whose check is a three-second TCP connect to the jump host. Before running anything against a dependant, recall checks the prerequisite and fails fast with a sentence the agent can act on: prerequisite 'vpn' is down, connect the VPN client and retry. No sixty-second kubectl timeout, no credential debugging.

[diagram: flow. exec request → prerequisites up? → setup steps → inject secrets → run → mask output]

## Checking that it all still works

Credentials expire, SSO sessions last a day, clusters get rebuilt. The last piece is a read-only sweep, `recall verify`, that runs every inventory entry's proof command and every secret's check command and reports one status per item.

[chart: split bar. Last full sweep, 121 checks: 104 ok, 17 skipped by choice]

The statuses are ok, stale (an authentication error, so log in or rotate), unreachable (a network error, not the credential's fault), missing (the context or profile does not exist on this machine) and skipped. Prerequisites are checked once, and anything that depends on a down prerequisite is skipped rather than misreported. Results are stored, so looking at any entry shows "last verified: ok 2h ago", and the agent can ask for a check before a task that spans several systems.

The part I was most careful about is that a verification sweep must not change anything. Every command passes through a syntactic guard before it runs: an allow-list per tool (`aws sts get-caller-identity`, `kubectl get`, `curl` without a body, `ssh host hostname`, `sudo -k true`) and a deny-list for anything that writes. A dry run prints the verdict for every command, so I can audit the whole plan before the first real run.

That sweep surfaced two more things. `az account set` is global state, so verifying four subscriptions in parallel raced and reported the wrong subscription for two of them; subscriptions now run one at a time. And a cluster's "switch context" step mutates the kubeconfig, so parallel runs collided on its lock file; the verifier drops that step and relies on `--context` in every command instead.

## If you build your own

Put the rules where the agent reads them. The tool is half of it. The other half is a few lines in the agent's instructions file: search before you grep, credentials come from recall and never from files or prompts, look up access before you reach a system, a 403 without VPN is not a bad token. Without those lines the agent uses the tool when it feels like it.

This is the block in my `CLAUDE.md`, trimmed to the parts that carry the rules:

```markdown
## recall
- Search first, grep never. For anything I may have written before (RCAs, runbooks,
  project notes, ticket keys, hostnames, "how did we fix…") call `recall_search`,
  then `recall_read` on the hit. Never grep or find in ~/notes.
- Credentials come from recall, never from files or prompts. When a command needs a
  token or password: `recall_secret_find "<what for>"` → `recall_secret_show ID`
  (read `use`) → `recall_secret_command ID "<cmd using $ENV_VAR>"` and run that line.
  Values are injected and masked. Never ask me to paste a secret, never read a .env
  file for one, never print a value.
- Before reaching any cluster, VM, cloud account or internal service:
  `recall_access_find "<what>"` → `recall_access_show ID` → `recall_access_exec ID [cmd]`.
  Never read ~/.kube/config, ~/.ssh/config or the env scripts to work it out.
- Entries with `requires: [vpn]` only work while the VPN is up. If exec fails with
  "prerequisite 'vpn' is down", tell me to connect the VPN. Do not retry or debug
  credentials; a 403 from those services without VPN is not a bad token.
- Before a task that spans several systems, or after an auth error, run
  `recall_verify` and act on the reason it gives: log in, connect VPN, or rotate.
```

Every line there came from watching the agent do the wrong thing once.

Keep the sources as plain files. The secrets and the inventory are YAML I edit in a normal editor and keep with my notes. The database is a cache that can be rebuilt from them at any time. That made every schema change cheap and kept the tool out of the way.

Measure with your own questions. Eighteen golden queries took half an hour to write and settled every ranking argument I had with myself, including the one where the expensive reranker lost.

Be as read-only as you can afford to be. The verify guard is syntactic and far from a sandbox, but it stops copy-paste accidents, and the dry run makes the whole plan reviewable. For a tool that runs commands on my behalf, that was the right trade.

The repository is small: a few thousand lines of Python, SQLite with the full-text and vector extensions, one embedding API. Nothing in it is novel. The work was in deciding what the agent may know, what it may use, and what it may never see, and then making the tool enforce that instead of hoping the agent remembers.
