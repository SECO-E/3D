---
name: prd-generator
description: Write Product Requirements Documents (PRDs) and feature specs — problem definition, user stories, scope, success metrics, and edge cases. Use when the user wants to spec a feature or product, write a PRD, hand requirements to engineers or an AI coding agent, or turn a vague idea into a buildable definition.
---

# PRD Generator

Turn an idea into a document a builder can implement without guessing. A good PRD is ruthless about the problem, explicit about scope (especially what's OUT), and measurable about success. Length is a cost — write the shortest PRD that removes ambiguity.

## When to use

- "Write a PRD for...", "spec out this feature", "turn this idea into requirements"
- Preparing work for engineers, contractors, or AI coding agents

## Process

### 1. Interrogate the idea

Before writing, establish (ask in one batch; propose defaults where the user is unsure):
- **The problem**: who has it, how painful, what they do today. If the user leads with a solution, work backwards to the problem and confirm it.
- **Evidence**: user requests, support tickets, data — or is this a hypothesis? (Say which.)
- **The user(s)**: primary persona; any admin/secondary roles
- **Success**: what number moves if this works?
- **Constraints**: deadline, platform, existing stack, team size

### 2. Write the PRD

```markdown
# PRD: [Feature/Product Name]
**Status:** Draft | **Owner:** [name] | **Last updated:** [date]

## 1. Problem
The user problem in the user's terms, with evidence. 1-2 paragraphs.
NOT the solution. If you can't write this section, stop — the feature isn't ready to spec.

## 2. Goals & success metrics
| Goal | Metric | Baseline | Target |
Plus explicit non-goals — what this deliberately does NOT try to achieve.

## 3. Users & scenarios
Primary persona + the 2-4 core scenarios as short narratives
("Ana gets a Slack ping, opens the dashboard, and needs to know within 10 seconds whether...").

## 4. Requirements
Grouped by scenario or component. Each requirement:
- Written as user story ("As a [role], I can [action] so that [outcome]") or plain capability statement
- Tagged P0 (launch-blocking) / P1 (fast-follow) / P2 (someday)
- With acceptance criteria a tester could verify

## 5. Out of scope
Explicit list. The most-fought-over and most valuable section. Include the tempting adjacent
things that were considered and cut, with one-line reasons.

## 6. UX notes
Flow description or wireframe placeholders; states to design: empty, loading, error, success, edge.

## 7. Edge cases & error handling
The unhappy paths: bad input, permissions, concurrency, limits, offline, deletion.

## 8. Open questions
Numbered, each with an owner and needed-by date.

## 9. Release & rollout
Flagged? Beta cohort? Migration needed? Announcement plan? How we'll measure the metrics in §2.
```

### 3. Quality checks before delivering

- Every P0 requirement traces to a scenario in §3; orphan requirements get cut or demoted.
- Acceptance criteria are testable ("loads in under 2s", not "loads fast").
- The out-of-scope list is non-empty. Always.
- No solution smuggled into the problem statement.
- An engineer reading only this doc could list the screens, states, and API surface — if not, fill the gap.

### 4. Variants

- **Lean spec** (small features): Problem, Requirements + acceptance criteria, Out of scope, Edge cases — one page.
- **For AI coding agents**: add concrete data shapes, name the files/modules likely touched, and turn acceptance criteria into verifiable checks.

## Rules

- Problem first; push back if only a solution is given.
- Scope cuts are the deliverable — a PRD that includes everything decides nothing.
- Mark hypotheses as hypotheses; never dress guesses as data.
- Prefer tables and numbered lists over prose walls; builders scan, not read.
