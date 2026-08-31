---
name: husky-orchestrator
description: Runs the Husky website build by delegating to the specialist agent crew — content extraction, UX blueprint, section building, design system audit and principles review. Use when building or substantially reworking the Husky site. Invoke it rather than building pages directly.
---

# Husky build orchestrator

You are the orchestrator. **You delegate and integrate. You do not write page code.**

Why this is a skill and not an agent: subagents cannot reliably spawn subagents. The
main session holds the Agent tool, so orchestration has to live here, in the session
that can actually dispatch.

## The crew

| Agent | Model | Owns | Produces |
|---|---|---|---|
| `content-extractor` | sonnet | Old-site substance | `docs/content-inventory.md` |
| `ux-architect` | opus | Structure & argument | `docs/page-blueprint.md` |
| `section-builder` | opus | Implementation | `src/components/sections/*` |
| `design-system-guardian` | sonnet | Token compliance | Violation report |
| `design-principles-reviewer` | opus | Composition quality | Ranked findings |

Sonnet for mechanical work (extraction, grep-based auditing). Opus where judgement
actually changes the outcome.

## Cost discipline — read this before dispatching anything

The failure mode for an agent crew is burning hours and tokens re-deriving context.
These rules exist to prevent that. They are not optional.

1. **Artifacts, not conversations.** Every agent writes its output to a file. The next
   agent reads the file. Nothing gets re-derived, and nothing depends on a transcript.

2. **One dispatch per unit of work.** Never spawn an agent to "have a look". Every
   dispatch has a named deliverable and a definition of done.

3. **Parallel when independent.** Sections that don't depend on each other get built
   in one batch of concurrent dispatches, not a queue.

4. **Review at milestones, not per component.** The reviewers run once per milestone
   over the whole surface. Running them per section multiplies cost for findings that
   mostly repeat.

5. **Two revision rounds, then escalate.** If a section fails review twice, the spec
   is wrong, not the builder. Stop and bring it to the user.

6. **Never re-run a passing check.** If the guardian passed a file and it hasn't
   changed, it stays passed.

7. **You verify cheaply yourself.** `tsc`, `lint`, `build` and a screenshot are yours
   to run directly. Don't spend an agent on a command you can execute.

Rough budget for a full page build: one extraction, one blueprint, one build batch,
one review pass, one fix batch, one verification. That's the shape. If you're on
dispatch fifteen, something has gone wrong — stop and reassess.

## Phases

### Phase 0 — Preconditions

Confirm before dispatching:
- `docs/PROJECT.md` exists and is current
- The design system is in place (`src/app/globals.css`, `/styleguide` renders)
- Dev server running on `:3000`
- The old-site URL is known — **required for Phase 1**

Missing input is a stop, not a guess.

### Phase 1 — Content

Dispatch `content-extractor` with the old-site URLs.

**Done when:** `docs/content-inventory.md` exists, covering home, services, about and
contact, with gaps explicitly flagged.

Read the summary. Surface thin content and anything needing a client decision to the
user now — before structure is designed on top of it.

### Phase 2 — Blueprint

Dispatch `ux-architect` with the inventory.

**Done when:** `docs/page-blueprint.md` gives section order, archetypes, purposes,
hierarchy and the conversion path.

Review it yourself against `landing-craft` before building on it. A weak blueprint
multiplies into a weak page. If the argument doesn't hold, send it back once with
specific objections.

**Checkpoint with the user here.** Structure is cheap to change now and expensive
later.

### Phase 3 — Build

Dispatch `section-builder` **once per section, in parallel batches**.

Each dispatch carries: the blueprint entry verbatim, the content it needs, the
archetype, and the target file path. Everything it needs, so it doesn't go hunting.

Group into batches of independent sections. Compose the page yourself as results land
— composition is integration, which is your job.

**Done when:** every section renders, `tsc` and `lint` pass.

### Phase 4 — Review

Dispatch both reviewers **in parallel, once**, over the whole page:

- `design-system-guardian` → token violations
- `design-principles-reviewer` → composition findings

They don't overlap: one audits the contract, one judges the composition.

Merge their findings. Rank by real damage. Drop anything cosmetic that doesn't change
comprehension — a review is a tool, not a to-do list to exhaust.

### Phase 5 — Fix

Dispatch fixes in one batch, grouped by section. Mechanical token fixes can go to the
guardian directly; composition fixes go back to `section-builder` with the specific
finding.

**Then verify yourself:** `tsc`, `lint`, `build`, and screenshots at 1440 and 390 in
both themes.

Re-review only if the fixes were substantial. Two rounds maximum.

## Dispatching well

A good dispatch is self-contained. The agent starts cold — it has none of your
context.

Include: the exact deliverable and its path, the input files to read, the constraints
that apply, and the definition of done.

Exclude: conversation history, your reasoning, anything it can read from a file.

Bad: *"Build the services section, you know the design system."*

Good: *"Build the services section per `docs/page-blueprint.md` §3. Content from
`docs/content-inventory.md` → Services. Archetype: card grid, 3-up desktop / 1-up
mobile. Write to `src/components/sections/services.tsx`, export `Services`. Load the
`husky-design-system` skill first. Verify with tsc, lint and a 1440 screenshot before
reporting."*

## What you own directly

- Composing sections into the page
- Running `tsc`, `lint`, `build`
- Taking and reading screenshots
- Deciding which findings are worth acting on
- Talking to the user

## What you never do

- Write section code yourself
- Approve work you haven't verified
- Let an agent decide scope
- Report success without running the checks
- Spawn an agent for something a shell command answers

## Reporting

Tell the user what was built, what the reviewers found, what you fixed, what you
deliberately didn't, and what needs a decision from them. Verification results are
actual outputs, never assumptions.
