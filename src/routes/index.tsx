import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import {
  data,
  findEntry,
  findFramework,
  frameworksByRegion,
  isProvisionalStatus,
  typeTone,
  GITHUB_URL,
  LAST_UPDATED,
  LEGEND_TYPES,
  type Divergence,
  type Entry,
  type Framework,
  type FrameworkType,
  type TypeTone,
} from "@/data/governance";

/**
 * Filter state lives in the URL so a filtered view can be shared.
 * `fw` = framework ids, `dim` = dimension ids, `q` = free-text search.
 * Empty/absent fw|dim = all selected; the "none" sentinel = nothing selected.
 */
const searchSchema = z.object({
  fw: fallback(z.string().array(), []).default([]),
  dim: fallback(z.string().array(), []).default([]),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "AI Governance Compass — Compare 16 AI Frameworks" },
      {
        name: "description",
        content:
          "Side-by-side comparison of 16 AI governance frameworks from every major region across seven governance dimensions.",
      },
      { property: "og:title", content: "AI Governance Compass" },
      {
        property: "og:description",
        content:
          "Compare AI governance frameworks across risk classification, transparency, oversight, documentation and enforcement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ── Framework type badge ──────────────────────────────────────────────────── */

/** Each tone gets its own colour so types stay distinguishable at a glance. */
const TONE_STYLES: Record<TypeTone, string> = {
  binding: "bg-binding-soft text-binding border-binding/25",
  treaty: "bg-treaty-soft text-treaty border-treaty/25",
  certifiable: "bg-certifiable-soft text-certifiable border-certifiable/25",
  voluntary: "bg-voluntary-soft text-voluntary border-voluntary/25",
  strategy: "bg-strategy-soft text-strategy border-strategy/25",
  multilateral: "bg-multilateral-soft text-multilateral border-multilateral/25",
  // Pending / no-binding-law: muted + dashed outline, deliberately not
  // visually equivalent to enacted law.
  pending: "bg-pending-soft text-pending border-pending/40 border-dashed",
};

function TypeBadge({
  type,
  className = "",
}: {
  type: FrameworkType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.08em] ${TONE_STYLES[typeTone(type)]} ${className}`}
    >
      {type}
    </span>
  );
}

function FrameworkBadge({ framework }: { framework: Framework }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.7rem] font-medium ${TONE_STYLES[typeTone(framework.type)]}`}
    >
      {framework.name}
    </span>
  );
}

/* ── Verification indicator ────────────────────────────────────────────────── */

/**
 * Understated data-confidence marker. Verified = subtle checkmark with the
 * verification date; unverified = dashed "provisional" chip.
 */
function VerifiedMark({
  verified,
  lastVerified,
  className = "",
}: {
  verified: boolean | undefined;
  lastVerified?: string | null;
  className?: string;
}) {
  const tip = verified
    ? lastVerified
      ? `Verified against primary source on ${lastVerified}`
      : "Verified against primary source"
    : "Not yet independently verified against primary source";

  if (verified) {
    return (
      <span
        title={tip}
        aria-label={tip}
        className={`inline-flex items-center gap-1 text-[0.65rem] text-certifiable/80 ${className}`}
      >
        <span aria-hidden>✓</span>
        {lastVerified ? <span className="tabular-nums">{lastVerified}</span> : null}
      </span>
    );
  }

  return (
    <span
      title={tip}
      aria-label={tip}
      className={`inline-flex items-center rounded-full border border-dashed border-ink/25 px-1.5 py-px text-[0.62rem] uppercase tracking-[0.08em] text-ink/40 ${className}`}
    >
      Provisional
    </span>
  );
}

/* ── Detail modal ──────────────────────────────────────────────────────────── */

interface Selection {
  entry: Entry;
  frameworkName: string;
  dimensionLabel: string;
  type: FrameworkType;
}

function DetailModal({
  selection,
  onClose,
}: {
  selection: Selection;
  onClose: () => void;
}) {
  const { entry, frameworkName, dimensionLabel, type } = selection;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${frameworkName} — ${dimensionLabel}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-t-2xl border border-rule bg-paper p-6 shadow-xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.14em] text-ink/50">
              {dimensionLabel}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ink">{frameworkName}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="-mt-1 rounded-full px-2 py-1 text-xl leading-none text-ink/50 transition-colors hover:bg-rule/60 hover:text-ink"
          >
            ×
          </button>
        </div>

        <TypeBadge type={type} className="mt-4" />

        <p className="mt-5 font-display text-lg leading-relaxed text-ink">
          {entry.summary}
        </p>

        <dl className="mt-6 space-y-3 border-t border-rule pt-5 text-sm">
          <div className="flex gap-3">
            <dt className="w-32 shrink-0 text-ink/50">Source clause</dt>
            <dd className="text-ink">{entry.sourceClause}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-32 shrink-0 text-ink/50">Verification</dt>
            <dd className="text-ink">
              {entry.verified
                ? `Verified${entry.lastVerified ? ` on ${entry.lastVerified}` : ""}`
                : "Not yet independently verified against primary source"}
            </dd>
          </div>
        </dl>

        {entry.note ? (
          <p className="mt-4 border-l-2 border-rule pl-3 text-xs leading-relaxed text-ink/55">
            {entry.note}
          </p>
        ) : null}

        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          View primary source <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}

/* ── Filter chips ──────────────────────────────────────────────────────────── */

function Chip({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`cursor-pointer select-none rounded-full border px-3 py-1 text-xs transition-colors ${
        on
          ? "border-ink bg-ink text-paper"
          : "border-rule bg-transparent text-ink/60 hover:border-ink/40"
      }`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={on}
        onChange={onToggle}
      />
      {label}
    </label>
  );
}

function FilterHeading({
  label,
  onAll,
  actionLabel = "Select all",
}: {
  label: string;
  onAll: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink/50">
        {label}
      </h2>
      <button
        onClick={onAll}
        className="text-xs text-ink/50 underline decoration-dotted transition-colors hover:text-ink"
      >
        {actionLabel}
      </button>
    </div>
  );
}

/** Collapsible region group of framework checkboxes. */
function RegionGroupFilter({
  region,
  frameworks,
  active,
  onToggle,
  onSelectGroup,
}: {
  region: string;
  frameworks: Framework[];
  active: string[];
  onToggle: (id: string) => void;
  onSelectGroup: () => void;
}) {
  const [open, setOpen] = useState(true);
  const count = frameworks.filter((f) => active.includes(f.id)).length;

  return (
    <div className="border-t border-rule pt-3">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
        >
          <span aria-hidden className="text-[0.6rem] text-ink/40">
            {open ? "▾" : "▸"}
          </span>
          {region}
          <span className="text-ink/40">
            ({count}/{frameworks.length})
          </span>
        </button>
        <button
          onClick={onSelectGroup}
          className="text-[0.7rem] text-ink/45 underline decoration-dotted transition-colors hover:text-ink"
        >
          Select all
        </button>
      </div>
      {open ? (
        <div className="mt-2 flex flex-wrap gap-2 pb-1">
          {frameworks.map((f) => (
            <Chip
              key={f.id}
              label={f.name}
              on={active.includes(f.id)}
              onToggle={() => onToggle(f.id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

function Index() {
  const { frameworks, dimensions, divergences } = data;

  // ── Filter state, read from (and written to) the URL query string ──────────
  const { fw, dim, q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [selection, setSelection] = useState<Selection | null>(null);

  const allFrameworkIds = useMemo(() => frameworks.map((f) => f.id), [frameworks]);
  const allDimensionIds = useMemo(() => dimensions.map((d) => d.id), [dimensions]);

  /** Absent param = everything selected; "none" sentinel = nothing selected. */
  const decode = (param: string[], all: string[]) =>
    param.length === 0 ? all : param.filter((id) => all.includes(id));

  const activeFrameworks = decode(fw, allFrameworkIds);
  const activeDimensions = decode(dim, allDimensionIds);

  const encode = (list: string[], all: string[]) =>
    list.length === all.length ? [] : list.length === 0 ? ["none"] : list;

  const setActiveFrameworks = (list: string[]) =>
    navigate({
      search: (prev) => ({ ...prev, fw: encode(list, allFrameworkIds) }),
      replace: true,
    });
  const setActiveDimensions = (list: string[]) =>
    navigate({
      search: (prev) => ({ ...prev, dim: encode(list, allDimensionIds) }),
      replace: true,
    });
  const setQuery = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, q: value }), replace: true });

  const toggle = (id: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  // ── Text search narrows both axes by framework name or dimension label ─────
  const query = q.trim().toLowerCase().slice(0, 100);

  const shownFrameworks = useMemo(() => {
    const base = frameworks.filter((f) => activeFrameworks.includes(f.id));
    if (!query) return base;
    // If the query matches a dimension label, keep all selected frameworks.
    const matchesDimension = dimensions.some((d) =>
      d.label.toLowerCase().includes(query),
    );
    const byName = base.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.jurisdiction.toLowerCase().includes(query),
    );
    if (byName.length > 0) return byName;
    return matchesDimension ? base : byName;
  }, [frameworks, dimensions, activeFrameworks, query]);

  const shownDimensions = useMemo(() => {
    const base = dimensions.filter((d) => activeDimensions.includes(d.id));
    if (!query) return base;
    const byLabel = base.filter((d) => d.label.toLowerCase().includes(query));
    return byLabel.length > 0 ? byLabel : base;
  }, [dimensions, activeDimensions, query]);

  /**
   * Divergence cards obey the SAME filters as the table: a card shows when its
   * frameworksInvolved overlaps the selected frameworks AND its dimensionIds
   * overlap the selected dimensions.
   */
  const shownDivergences = useMemo(() => {
    const fwIds = new Set(shownFrameworks.map((f) => f.id));
    const dimIds = new Set(shownDimensions.map((d) => d.id));
    return divergences.filter(
      (d: Divergence) =>
        d.frameworksInvolved.some((id) => fwIds.has(id)) &&
        d.dimensionIds.some((id) => dimIds.has(id)),
    );
  }, [divergences, shownFrameworks, shownDimensions]);

  const regionGroups = useMemo(() => frameworksByRegion(frameworks), [frameworks]);

  const open = (framework: Framework, dimensionLabel: string, entry: Entry) =>
    setSelection({
      entry,
      frameworkName: framework.name,
      dimensionLabel,
      type: framework.type,
    });

  /** Muted, outlined column/card styling for not-yet-binding frameworks. */
  const provisionalCls = (f: Framework) =>
    isProvisionalStatus(f.type) ? "opacity-75" : "";

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <header className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink/45">
            Independent research
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            AI Governance Compass
          </h1>
          <p className="mt-4 max-w-2xl font-display text-lg leading-relaxed text-ink/70 sm:text-xl">
            A side-by-side reading of {frameworks.length} AI governance
            frameworks from every major region — what each one actually
            requires, and where they part ways.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-rule pt-6">
            <span className="mr-1 text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
              Legend
            </span>
            {LEGEND_TYPES.map((t) => (
              <span
                key={t.tone}
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.08em] ${TONE_STYLES[t.tone]}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Filters */}
        <section className="grid gap-8 border-b border-rule py-10 sm:grid-cols-2">
          {/* Frameworks — grouped by region, each group collapsible */}
          <div>
            <FilterHeading
              label={`Frameworks (columns) · ${activeFrameworks.length}/${frameworks.length}`}
              onAll={() => setActiveFrameworks(allFrameworkIds)}
            />
            <div className="mt-3">
              {regionGroups.map((g) => (
                <RegionGroupFilter
                  key={g.region}
                  region={g.region}
                  frameworks={g.frameworks}
                  active={activeFrameworks}
                  onToggle={(id) =>
                    toggle(id, activeFrameworks, setActiveFrameworks)
                  }
                  onSelectGroup={() =>
                    setActiveFrameworks(
                      Array.from(
                        new Set([
                          ...activeFrameworks,
                          ...g.frameworks.map((f) => f.id),
                        ]),
                      ),
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <FilterHeading
              label="Dimensions (rows)"
              onAll={() => setActiveDimensions(allDimensionIds)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {dimensions.map((d) => (
                <Chip
                  key={d.id}
                  label={d.label}
                  on={activeDimensions.includes(d.id)}
                  onToggle={() =>
                    toggle(d.id, activeDimensions, setActiveDimensions)
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison — table on desktop */}
        <section className="py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">The comparison</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink/60">
                Select any cell to read the full summary, its clause reference
                and a link to the primary text.
              </p>
            </div>
            <label className="w-full max-w-xs">
              <span className="sr-only">Search frameworks or dimensions</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search framework or dimension…"
                className="w-full rounded-full border border-rule bg-transparent px-4 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
              />
            </label>
          </div>

          {shownFrameworks.length === 0 || shownDimensions.length === 0 ? (
            <p className="mt-10 border-t border-rule pt-10 text-sm text-ink/50">
              Select at least one framework and one dimension to view the
              comparison.
            </p>
          ) : (
            <>
              <div className="mt-8 hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left align-top">
                  <thead>
                    <tr className="border-y border-ink/70">
                      <th
                        scope="col"
                        className="w-48 py-4 pr-4 align-bottom text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink/50"
                      >
                        Dimension
                      </th>
                      {shownFrameworks.map((f) => (
                        <th
                          key={f.id}
                          scope="col"
                          className={`min-w-56 px-4 py-4 align-bottom ${provisionalCls(f)}`}
                        >
                          <span className="block font-display text-lg leading-tight">
                            {f.name}
                          </span>
                          <span className="mt-1 block text-xs text-ink/50">
                            {f.jurisdiction}
                          </span>
                          <TypeBadge type={f.type} className="mt-2" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shownDimensions.map((d) => (
                      <tr key={d.id} className="border-b border-rule">
                        <th
                          scope="row"
                          className="py-5 pr-4 align-top font-display text-base font-normal leading-snug"
                        >
                          {d.label}
                        </th>
                        {shownFrameworks.map((f) => {
                          const entry = findEntry(f.id, d.id);
                          if (!entry) {
                            return (
                              <td
                                key={f.id}
                                className="px-4 py-5 align-top text-sm text-ink/35"
                              >
                                No provision
                              </td>
                            );
                          }
                          return (
                            <td
                              key={f.id}
                              className={`align-top ${provisionalCls(f)}`}
                            >
                              <button
                                onClick={() => open(f, d.label, entry)}
                                className="group h-full w-full px-4 py-5 text-left transition-colors hover:bg-rule/35"
                              >
                                <span className="block text-sm leading-relaxed text-ink/80">
                                  {entry.summary}
                                </span>
                                <span className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="text-[0.7rem] uppercase tracking-[0.1em] text-ink/40 group-hover:text-ink/70">
                                    {entry.sourceClause}
                                  </span>
                                  <VerifiedMark
                                    verified={entry.verified}
                                    lastVerified={entry.lastVerified}
                                  />
                                </span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparison — stacked cards on mobile */}
              <div className="mt-8 space-y-10 md:hidden">
                {shownDimensions.map((d) => (
                  <div key={d.id}>
                    <h3 className="border-b border-ink/70 pb-2 font-display text-lg">
                      {d.label}
                    </h3>
                    <div className="divide-y divide-rule">
                      {shownFrameworks.map((f) => {
                        const entry = findEntry(f.id, d.id);
                        return (
                          <div
                            key={f.id}
                            className={`py-4 ${provisionalCls(f)}`}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-base">
                                {f.name}
                              </span>
                              <TypeBadge type={f.type} />
                            </div>
                            {entry ? (
                              <button
                                onClick={() => open(f, d.label, entry)}
                                className="mt-2 w-full text-left"
                              >
                                <span className="block text-sm leading-relaxed text-ink/80">
                                  {entry.summary}
                                </span>
                                <span className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="text-[0.7rem] uppercase tracking-[0.1em] text-ink/45">
                                    {entry.sourceClause} · tap for detail
                                  </span>
                                  <VerifiedMark
                                    verified={entry.verified}
                                    lastVerified={entry.lastVerified}
                                  />
                                </span>
                              </button>
                            ) : (
                              <p className="mt-2 text-sm text-ink/35">
                                No provision
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Divergences */}
        <section className="border-t border-rule py-12">
          <h2 className="font-display text-2xl sm:text-3xl">
            Where they diverge
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Structural disagreements and gaps that cut across the frameworks
            above.
          </p>
          {shownDivergences.length === 0 ? (
            <p className="mt-10 border-t border-rule pt-10 text-sm text-ink/50">
              No divergences match your current filters — try selecting more
              frameworks or dimensions.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {shownDivergences.map((div) => (
                <article
                  key={div.id}
                  className="rounded-lg border border-divergence/25 bg-divergence-soft/60 p-6"
                >
                  <span
                    className="block h-0.5 w-10 bg-divergence"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-display text-xl leading-snug">
                    {div.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">
                    {div.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {div.frameworksInvolved.map((id) => {
                      const f = findFramework(id);
                      return f ? <FrameworkBadge key={id} framework={f} /> : null;
                    })}
                  </div>
                  <div className="mt-4 border-t border-divergence/15 pt-3">
                    <VerifiedMark
                      verified={div.verified ?? false}
                      lastVerified={div.lastVerified ?? null}
                    />
                    {div.note ? (
                      <details className="mt-2">
                        <summary
                          title={div.note}
                          className="cursor-pointer list-none text-[0.7rem] uppercase tracking-[0.1em] text-ink/45 transition-colors hover:text-ink"
                        >
                          Verification note
                        </summary>
                        <p className="mt-2 border-l-2 border-divergence/25 pl-3 text-xs leading-relaxed text-ink/60">
                          {div.note}
                        </p>
                      </details>
                    ) : null}
                  </div>

                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="max-w-2xl text-sm leading-relaxed text-ink/60">
            <span className="font-medium text-ink">Methodology.</span>{" "}
            {frameworks.length} frameworks across every major region. See full
            methodology and source verification status on GitHub. Last updated{" "}
            {LAST_UPDATED}. This is an independent research project, not
            affiliated with any framework body.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-1.5 border-b border-ink/25 pb-0.5 text-sm text-ink transition-colors hover:border-ink"
          >
            View the data on GitHub <span aria-hidden>↗</span>
          </a>
        </div>
      </footer>

      {selection && (
        <DetailModal selection={selection} onClose={() => setSelection(null)} />
      )}
    </div>
  );
}
