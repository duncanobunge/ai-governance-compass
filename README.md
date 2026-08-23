# AI Governance Compass

A side-by-side, source-cited comparison of the world's leading AI governance frameworks — what each one actually requires, and where they part ways.

**Live demo:** [ai-rules-explorer.lovable.app](https://ai-rules-explorer.lovable.app/) — prototype build; source hosted at [github.com/duncanobunge/ai-governance-compass](https://github.com/duncanobunge/ai-governance-compass/)

![screenshot placeholder](docs/screenshot.png)

## What this is

Most AI governance comparisons are either static blog posts (accurate once, stale forever) or paid enterprise platforms behind a signup wall. This project is neither: it's a small, open, actively-maintained dataset and interactive comparison tool with genuinely global coverage — **16 frameworks across every major region**:

| Region | Frameworks |
|---|---|
| Europe | EU AI Act, UK Pro-Innovation Framework, Council of Europe Framework Convention on AI |
| North America | NIST AI RMF (US), Canada (post-AIDA landscape — currently no binding AI law) |
| East Asia | China Generative AI Measures, South Korea AI Basic Act |
| Southeast / South Asia | Singapore Model AI Governance Framework, India AI Governance Guidelines |
| Latin America | Brazil AI Bill (PL 2338/2023 — pending) |
| Africa | Kenya Data Protection Act, African Union Continental AI Strategy |
| Middle East | UAE National AI Strategy 2031 |
| International standards | ISO/IEC 42001 |
| Multilateral | OECD AI Principles, UNESCO Recommendation on the Ethics of AI |

...compared across seven governance dimensions: risk classification, legal status, data governance, transparency, human oversight, documentation, and enforcement.

Every entry links to a **primary source** (the actual regulatory text, not a secondary summary), and the "Where they diverge" section surfaces genuine conflicts and gaps between frameworks — not just where they overlap.

## Why this exists

Built as a personal research/portfolio project at the intersection of AI governance, data governance, and responsible AI. See [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md) for the sourcing standard and [`docs/CHANGELOG.md`](docs/CHANGELOG.md) for a dated history of what's been added, corrected, or verified over time.

## Project structure

```
ai-governance-compass/
├── data/
│   └── frameworks.json     — single source-of-truth dataset (frameworks, dimensions, entries, divergences)
├── docs/
│   ├── METHODOLOGY.md       — sourcing standard, verification process, update cadence
│   ├── SOURCES.md           — direct links to every primary text used
│   └── CHANGELOG.md         — dated log of additions, corrections, verifications
├── src/                     — application code
└── CONTRIBUTING.md          — how to propose a framework addition or correction
```

## Data confidence

Not every entry is verified to the same standard yet. Each entry in `data/frameworks.json` carries a `verified` boolean and `lastVerified` date. As of the last update:

**Fully verified against primary/official sources:**
- Kenya Data Protection Act (2019)
- EU AI Act
- South Korea AI Basic Act (key provisions: effective date, transparency, risk assessment, enforcement grace period)
- China Generative AI Measures (effective date, scope, filing/labelling requirements)
- Canada (confirmed AIDA lapsed — no binding AI law currently in force)
- Brazil AI Bill PL 2338/2023 (confirmed pending, not yet enacted, with penalty figures)

**Provisional — sourced from secondary summaries, not yet re-checked against primary text:**
- NIST AI RMF, ISO/IEC 42001 (ISO's full text is paywalled)
- UK Pro-Innovation AI Framework, Singapore Model AI Governance Framework, India AI Governance Guidelines, African Union Continental AI Strategy, UAE National AI Strategy 2031, OECD AI Principles, UNESCO Recommendation on the Ethics of AI, Council of Europe Framework Convention on AI

This is deliberate: it's more useful to be honest about what's verified than to present everything with false uniform confidence. See `docs/SOURCES.md` for the full breakdown and links to every primary source.

## Local development

```bash
git clone https://github.com/duncanobunge/ai-governance-compass.git
cd ai-governance-compass
# install & run instructions depend on your chosen frontend stack — fill in once finalized
```

## License

MIT — see [LICENSE](LICENSE). Data and code are both freely reusable; attribution appreciated.

## Disclaimer

Independent research project. Not affiliated with the European Commission, NIST, ISO, or Kenya's Office of the Data Protection Commissioner. Not legal advice — always verify against primary sources before relying on this for compliance decisions.
