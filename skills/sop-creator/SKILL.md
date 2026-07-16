---
name: sop-creator
description: Create clear, actionable Standard Operating Procedures (SOPs) for any business process. Use when the user wants to document a process, create an SOP, write a runbook, standardize how a task is done, or prepare process documentation for delegating work to a team member, VA, or contractor.
---

# SOP Creator

Turn any business process into a Standard Operating Procedure that someone with zero context can follow and get the same result every time.

## When to use

- The user describes a process they do repeatedly and wants it documented
- The user is delegating work to a new hire, VA, or contractor
- The user says "write an SOP for...", "document how we...", "create a runbook for..."

## Process

### 1. Extract the process

If the user hasn't fully described the process, ask targeted questions (max 3-5 at once):

- What is the end result of this process? How do you know it was done correctly?
- What triggers this process? (schedule, event, request)
- Walk me through the steps as you'd do them today, including tools and logins involved
- What goes wrong most often? What do people mess up?
- Who performs this today, and who will perform it after the SOP exists?

If the user has already given enough detail, don't interrogate — draft and let them correct.

### 2. Write the SOP

Use this structure:

```markdown
# SOP: [Process Name]

**Owner:** [role, not person's name]
**Frequency:** [when/how often this runs]
**Time required:** [estimate]
**Tools needed:** [list with links]
**Last updated:** [date]

## Purpose
One paragraph: what this process achieves and why it matters to the business.

## Definition of done
Bullet list of verifiable outcomes. A checker should be able to confirm each one.

## Prerequisites
Access, accounts, files, or information needed BEFORE starting.

## Steps
1. Numbered, imperative steps ("Open X", "Click Y", "Send Z")
2. One action per step
3. Include what the person should SEE after each critical step ("You should now see...")
4. Screenshots placeholders where visuals matter: `[Screenshot: ...]`

## Edge cases & troubleshooting
| If this happens | Do this |
|---|---|

## Escalation
When to stop and ask, and who to ask.
```

### 3. Quality rules

- **Zero-context test**: every step must be executable by someone who has never done this. No "handle it as usual".
- **One action per step.** Split compound steps.
- **Imperative voice.** "Export the CSV", not "The CSV should be exported".
- **Name tools explicitly** with URLs where possible.
- **Decision points become explicit branches**: "If X → go to step 7. If Y → go to step 9."
- **Quantify vagueness**: "respond quickly" → "respond within 4 business hours".
- Include the failure modes the user mentioned as edge cases — they're the most valuable part.

### 4. Deliver

Output the SOP as a markdown file (or document, if the user prefers). Offer to:
- Create a checklist version (just the steps, for daily use)
- Break a long SOP into sub-SOPs if it exceeds ~20 steps
- Draft the Loom/video script if visuals would help
