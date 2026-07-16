# founder-skills

Claude Code skills for founders — SOPs, CRO, content creation, outreach, and strategic planning.

A [Claude Code plugin](https://code.claude.com/docs/en/claude-code/plugins) bundling 15 skills that cover the marketing, strategy, and operations work founders do every week.

## Installation

Add the marketplace and install the plugin from within Claude Code:

```
/plugin marketplace add ognjengt/founder-skills
/plugin install founder-skills@founder-skills
```

## Skills

| Skill | What it does |
|---|---|
| `sop-creator` | Turn any process into a Standard Operating Procedure a new hire can follow |
| `cro-optimization` | Audit landing pages and funnels; prioritized conversion fixes with rewritten copy |
| `viral-hook-creator` | Scroll-stopping hooks for posts, videos, emails, and ads |
| `lead-magnet-generator` | Design and fully create lead magnets plus the capture funnel around them |
| `strategic-planning` | Quarterly/annual plans, OKRs, and the "not-doing" list |
| `go-to-market-plan` | Positioning, channel selection, and a 90-day launch plan with numbers |
| `x-writer` | Posts and threads for X that sound human and earn follows |
| `linkedin-writer` | LinkedIn posts that build authority without the cringe |
| `outreach-specialist` | Cold emails, DMs, and sequences that get replies |
| `competitor-intel` | Competitive analysis, positioning maps, and sales battlecards |
| `brand-copywriter` | Website copy, taglines, and brand voice guidelines |
| `pricing-strategist` | Pricing models, tier design, price points, and increase rollouts |
| `prd-generator` | PRDs and feature specs builders (human or AI) can implement without guessing |
| `product-hunt-launch-plan` | Full PH launch operation: timeline, assets, hour-by-hour playbook |
| `marketing-ideas` | Prioritized, business-specific growth experiments with kill criteria |

## Usage

Skills activate automatically when your request matches — e.g. "write an SOP for our client onboarding", "review my landing page", "plan my Product Hunt launch" — or invoke one directly with `/sop-creator`, `/x-writer`, etc.

## Structure

```
.claude-plugin/
  marketplace.json   # marketplace manifest
  plugin.json        # plugin manifest
skills/
  <skill-name>/
    SKILL.md         # one directory per skill
```

## License

MIT

## Author

[Ognjen Gatalo](https://github.com/ognjengt)
