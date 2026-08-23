# AI Governance Compass

A side-by-side, source-cited comparison of the world's leading AI governance frameworks — what each one actually requires, and where they part ways.

**Live demo:** [ai-rules-explorer.lovable.app](https://ai-rules-explorer.lovable.app/) *(replace with your own hosted URL once you deploy independently of Lovable's preview domain)*

![screenshot placeholder](docs/screenshot.png)

## What this is

Most AI governance comparisons are either static blog posts (accurate once, stale forever) or paid enterprise platforms behind a signup wall. This project is neither: it's a small, open, actively-maintained dataset and interactive comparison tool covering:

- **EU AI Act** — binding regulation, European Union
- **NIST AI RMF** — voluntary framework, United States
- **ISO/IEC 42001** — certifiable management-system standard, international
- **Kenya Data Protection Act, 2019** — binding regulation, Kenya

...across seven governance dimensions: risk classification, legal status, data governance, transparency, human oversight, documentation, and enforcement.

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

- **Kenya Data Protection Act** entries: fully verified against the official consolidated text at [new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2019/24)
- **EU AI Act** entries: fully verified against [artificialintelligenceact.eu](https://artificialintelligenceact.eu/) and the EU's own [AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/)
- **NIST AI RMF** and **ISO/IEC 42001** entries: sourced from secondary summaries, not yet independently re-verified against the primary text (ISO 42001's full text is paywalled). Treat these clause references as provisional until confirmed.

This is deliberate: it's more useful to be honest about what's verified than to present everything with false uniform confidence.

## Local development

```bash
git clone https://github.com/YOUR-USERNAME/ai-governance-compass.git
cd ai-governance-compass
# install & run instructions depend on your chosen frontend stack — fill in once finalized
```

## License

MIT — see [LICENSE](LICENSE). Data and code are both freely reusable; attribution appreciated.

## Disclaimer

Independent research project. Not affiliated with the European Commission, NIST, ISO, or Kenya's Office of the Data Protection Commissioner. Not legal advice — always verify against primary sources before relying on this for compliance decisions.
