# Changelog

All notable changes to the dataset and project are logged here, most recent first. This log is part of the project's evidence trail — it demonstrates the dataset is actively maintained, not a one-time snapshot.

## 2026-08-23

### Verified
- Confirmed all 4 Kenya Data Protection Act entries against the official consolidated text at `new.kenyalaw.org` (Sec. 25, 26, 29, 30, 31, 35, 50, 63).
- Confirmed all 6 cited EU AI Act articles (10, 11–12, 14, 50, 99, 113) against `artificialintelligenceact.eu` and the European Commission's AI Act Service Desk.

### Corrected
- **Kenya DPA — Enforcement entry:** changed "Penalties up to KES 5m or 1% of annual turnover, plus compensation" to "Administrative fines up to KES 5m or 1% of annual turnover, **whichever is lower**." The qualifier was missing and materially changes the claim. Removed the unverified "plus compensation" claim pending confirmation of the specific statutory basis.
- **Kenya DPA — Data governance entry:** split the citation so that lawful-basis/minimisation rules cite Sec. 25/30, and data-localisation is separately attributed to Sec. 50 (previously all three concepts were incorrectly grouped under Sec. 25/30).

### Added
- `verified` and `lastVerified` fields on every entry in `data/frameworks.json`, to make source confidence explicit and auditable rather than uniform.
- `dimensionId`/`dimensionIds` tagging on divergence entries, enabling the "Where they diverge" section to be filtered by the same dimension filters used on the comparison table.
- `docs/METHODOLOGY.md`, `docs/SOURCES.md`, this changelog, and `CONTRIBUTING.md`.

### Known gaps (tracked, not yet resolved)
- NIST AI RMF and ISO/IEC 42001 clause citations remain unverified against primary text (NIST RMF PDF not yet re-checked; ISO 42001 full text is paywalled). See `README.md` "Data confidence" section.
- Coverage limited to 4 frameworks; no African Union, Southeast Asian, or Latin American frameworks yet included.

## 2026-08-XX (prototype)

- Initial prototype built via Lovable: 4 frameworks × 7 dimensions comparison table, filterable by framework and dimension, plus a static (non-filterable) "Where they diverge" section.
- Data was seeded as placeholder/best-effort content, not yet source-verified.
