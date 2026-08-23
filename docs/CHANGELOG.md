# Changelog

All notable changes to the dataset and project are logged here, most recent first. This log is part of the project's evidence trail — it demonstrates the dataset is actively maintained, not a one-time snapshot.

## 2026-08-23 (b) — Global expansion

### Added
- Expanded from 4 to **16 frameworks**, spanning every major region: North America (Canada), Europe (EU, UK, Council of Europe), East Asia (China, South Korea), Southeast Asia (Singapore), South Asia (India), Latin America (Brazil), Africa (Kenya, African Union), Middle East (UAE), and three multilateral instruments (OECD, UNESCO, Council of Europe treaty).
- 84 new entries (12 frameworks × 7 dimensions), bringing the dataset to 112 total entries.
- 3 new divergence entries capturing global-scale patterns: major economies without binding AI law, the wide spread of what "regulation" means by jurisdiction, and the ratification gap in the only binding international AI treaty.

### Verified this pass
- **South Korea AI Basic Act**: confirmed effective date (22 Jan 2026), Act No. 20676, transparency (Art. 31) and risk-assessment (Art. 32) provisions, and the one-year enforcement grace period.
- **China Generative AI Measures**: confirmed effective date (15 Aug 2023), extraterritorial scope, filing/labelling requirements, and that the Measures carry no standalone penalty schedule (enforcement runs through the Cybersecurity Law, Data Security Law, and PIPL instead).
- **Canada**: confirmed AIDA (Bill C-27) died on the order paper in January 2025 and has not been reintroduced — corrected an earlier planning assumption that treated AIDA as a live framework. Canada is now correctly listed as having no binding federal AI-specific law.
- **Brazil**: confirmed PL 2338/2023 is Senate-approved (Dec 2024) but still pending in the Chamber of Deputies as of mid-2026 — listed as "pending," not "in force."

### Known gaps (tracked, not yet resolved)
- The 12 newly added frameworks are mostly marked `"verified": false` pending direct primary-source confirmation — see `docs/SOURCES.md` for what's outstanding. This mirrors the honesty standard already applied to NIST AI RMF and ISO/IEC 42001.
- Coverage is now broad but not exhaustive — no Japan-specific entry yet, and several jurisdictions (e.g., most Latin American and Southeast Asian countries beyond Singapore/Brazil) are still unrepresented.

## 2026-08-23 (a)

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
