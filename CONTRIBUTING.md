# Contributing

This project welcomes corrections and additions, especially:
- Fixing or verifying a clause citation (particularly NIST AI RMF and ISO/IEC 42001 entries, currently marked `"verified": false`)
- Adding a new jurisdiction or framework, especially ones currently underrepresented in mainstream AI governance comparisons (e.g., African Union, ASEAN member states, Latin America)
- Flagging outdated information as frameworks are amended

## Ground rules

1. **Primary sources only.** Any change to a clause reference or summary must cite the actual regulatory/standards text, not a secondary blog post. See `docs/METHODOLOGY.md` for the full standard.
2. **One change, one PR.** Keep pull requests scoped to a single correction or addition so they're easy to review.
3. **Update the changelog.** Any change to `data/frameworks.json` should include a corresponding entry in `docs/CHANGELOG.md` — date, what changed, why.
4. **No verbatim reproduction.** Summaries must be original paraphrase, not copy-pasted legal text.

## How to propose a change

1. Fork the repo
2. Edit `data/frameworks.json` (and `docs/SOURCES.md` if adding a new source, `docs/CHANGELOG.md` for the log entry)
3. Open a pull request describing the source you verified against and a direct link to it
4. Set `"verified": true` and `"lastVerified"` only if you've directly checked the primary text yourself

## Adding a new framework or jurisdiction

Open an issue first to discuss scope before submitting a large PR — this keeps the dataset's quality bar consistent and avoids duplicated effort.
