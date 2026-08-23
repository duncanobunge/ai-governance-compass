# Methodology

## Purpose

This document defines how entries in `data/frameworks.json` are selected, sourced, and verified. It exists so that anyone using this comparison — or considering contributing to it — knows exactly what standard of evidence backs each claim.

## Sourcing standard

Every entry must meet the following before being marked `"verified": true`:

1. **Primary source only.** The entry must be checked against the actual regulatory or standards text — the statute, regulation, or standard itself — not a law firm's client alert, a compliance vendor's blog post, or a secondary summary. Secondary sources are useful for *finding* the right clause, never for confirming it.
2. **Exact clause reference.** Article, section, or clause numbers must be quoted precisely (e.g., "Sec. 31" not "around Section 30 or so"). If a claim spans multiple provisions, all relevant clauses are cited.
3. **Direct link.** Wherever an official government or standards-body portal exists (e.g., Kenya Law's `new.kenyalaw.org`, the EU's `artificialintelligenceact.eu` or AI Act Service Desk), the entry links there — not to a mirror or a paywalled reseller.
4. **Paraphrase, not reproduction.** Summaries in this dataset are written in original language. They are not verbatim extracts of the legal text, in line with standard copyright practice for derivative reference works.
5. **Currency check.** Where a framework has pending amendments (e.g., Kenya's Data Protection Amendment Bill, 2025), the entry reflects the law *as currently in force*, with a note distinguishing proposed changes from binding text.

## What "verified" means in this dataset

Each entry carries:
- `"verified": true/false` — whether the clause reference has been directly checked against primary text per the standard above
- `"lastVerified"` — the date of that check (or `null` if not yet done)
- an optional `"note"` field flagging known limitations, corrections, or pending amendments

As of the current dataset version:
- **EU AI Act** and **Kenya Data Protection Act** entries are fully verified against primary/official sources.
- **NIST AI RMF** and **ISO/IEC 42001** entries are provisional, sourced from secondary compliance guides. ISO 42001's authoritative text is paywalled by ISO, which is a genuine practical obstacle — noted here rather than hidden.

## Update cadence

This is a living dataset, not a one-time snapshot. Updates happen when:
- A framework is amended (e.g., EU AI Act Digital Omnibus changes, Kenya's pending 2025 Amendment Bill passing into law)
- A citation is found to be incorrect or imprecise (see `CHANGELOG.md` for the correction history)
- A new framework or jurisdiction is added

Every substantive change is logged in `docs/CHANGELOG.md` with a date, so the dataset's evolution is auditable — not just its current state.

## Choosing what counts as a "divergence"

Entries in the `divergences` array are not simply differences (frameworks differ on almost every clause by wording). They are included only where the difference has a *practical consequence* — e.g., where the same AI system could be treated as compliant under one framework and non-compliant or unaddressed under another, or where a structural gap (like agentic AI oversight) is shared across multiple frameworks simultaneously.

## Limitations

- This is a single-researcher project, not a peer-reviewed legal analysis. It should inform research and discussion, not replace legal counsel.
- Coverage is currently limited to four frameworks. It does not yet reflect the full global landscape (e.g., China's AI regulations, Brazil's AI bill, the AU's draft continental AI strategy).
- "Binding regulation" vs "voluntary framework" labels reflect the framework's *formal* legal status; real-world enforceability (e.g., NIST AI RMF's de facto influence via procurement) is discussed in entry text, not the type label.
