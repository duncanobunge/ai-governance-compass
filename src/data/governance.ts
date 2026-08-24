/**
 * AI Governance Compass — single source of truth.
 *
 * EDITING GUIDE
 * -------------
 * ALL content lives in `governance.json`. To update the dataset (add a
 * framework, dimension, entry or divergence) edit that JSON file only —
 * no component code needs to change.
 *
 * This module only:
 *  - types the JSON,
 *  - derives a region label per framework (for the grouped filter),
 *  - classifies framework `type` strings into visual buckets,
 *  - exposes small lookup helpers.
 */

import raw from "./governance.json";

/* ── Types ─────────────────────────────────────────────────────────────────── */

/** Free-form in the data; classified for display via `typeTone()`. */
export type FrameworkType = string;

export interface Framework {
  id: string;
  name: string;
  type: FrameworkType;
  jurisdiction: string;
  officialSourceUrl?: string;
}

export interface Dimension {
  id: string;
  label: string;
}

export interface Entry {
  frameworkId: string;
  dimensionId: string;
  summary: string;
  sourceClause: string;
  sourceUrl: string;
  /** True when the clause reference was checked against the primary source. */
  verified: boolean;
  /** ISO date of the last verification, or null when never verified. */
  lastVerified: string | null;
  note?: string;
}

export interface Divergence {
  id: string;
  title: string;
  description: string;
  frameworksInvolved: string[];
  dimensionIds: string[];
  verified?: boolean;
  lastVerified?: string | null;
  note?: string;
}

export interface GovernanceMeta {
  title: string;
  description: string;
  lastUpdated: string;
  methodologyUrl?: string;
  sourcesUrl?: string;
}

export interface GovernanceData {
  meta: GovernanceMeta;
  frameworks: Framework[];
  dimensions: Dimension[];
  entries: Entry[];
  divergences: Divergence[];
}

export const data = raw as unknown as GovernanceData;

/** Date shown in the footer methodology note. */
export const LAST_UPDATED = data.meta.lastUpdated;

/** Repository link used in the footer. */
export const GITHUB_URL =
  "https://github.com/duncanobunge/ai-governance-compass/";

/* ── Visual classification of framework types ──────────────────────────────── */

/**
 * Tone buckets keep the badge palette meaningful without hardcoding every
 * literal type string in components. New type strings fall back sensibly.
 */
export type TypeTone =
  | "binding" // enacted, enforceable law or regulation
  | "treaty" // binding international instrument
  | "certifiable" // auditable/certifiable standard
  | "voluntary" // voluntary organisational framework
  | "strategy" // national/continental strategy or policy framework
  | "multilateral" // multilateral principles / recommendations
  | "pending"; // pending legislation or no binding law yet

export function typeTone(type: FrameworkType): TypeTone {
  const t = type.toLowerCase();
  if (t.includes("pending") || t.includes("no binding")) return "pending";
  if (t.includes("treaty")) return "treaty";
  if (t.includes("certifiable")) return "certifiable";
  if (t.includes("multilateral")) return "multilateral";
  if (t.includes("strategy") || t.includes("policy") || t.includes("guidance"))
    return "strategy";
  if (t.includes("voluntary")) return "voluntary";
  if (t.includes("binding")) return "binding";
  return "voluntary";
}

/** True for frameworks that are not (yet) enacted binding law. */
export function isProvisionalStatus(type: FrameworkType): boolean {
  return typeTone(type) === "pending";
}

/** One representative type string per tone, for the header legend. */
export const LEGEND_TYPES: { tone: TypeTone; label: string }[] = [
  { tone: "binding", label: "Binding regulation" },
  { tone: "treaty", label: "Binding treaty" },
  { tone: "certifiable", label: "Certifiable standard" },
  { tone: "voluntary", label: "Voluntary framework" },
  { tone: "strategy", label: "National strategy / policy" },
  { tone: "multilateral", label: "Multilateral principles" },
  { tone: "pending", label: "Pending / no binding law" },
];

/* ── Region grouping (derived from `jurisdiction`) ──────────────────────────── */

const REGION_BY_JURISDICTION: Record<string, string> = {
  "European Union": "Europe",
  "United Kingdom": "Europe",
  "United States": "North America",
  Canada: "North America",
  "South Korea": "East Asia",
  China: "East Asia",
  Singapore: "Southeast & South Asia",
  India: "Southeast & South Asia",
  Brazil: "Latin America",
  Kenya: "Africa",
  "African Union (continental)": "Africa",
  "United Arab Emirates": "Middle East",
};

/** Region label used to group the framework filter checkboxes. */
export function regionOf(framework: Framework): string {
  const mapped = REGION_BY_JURISDICTION[framework.jurisdiction];
  if (mapped) return mapped;
  if (framework.jurisdiction.toLowerCase().startsWith("international"))
    return "Multilateral";
  return "Other";
}

/** Display order for region groups. */
export const REGION_ORDER = [
  "Europe",
  "North America",
  "East Asia",
  "Southeast & South Asia",
  "Latin America",
  "Africa",
  "Middle East",
  "Multilateral",
  "Other",
];

export interface RegionGroup {
  region: string;
  frameworks: Framework[];
}

/** Frameworks bucketed by region, in REGION_ORDER order. */
export function frameworksByRegion(
  frameworks: Framework[] = data.frameworks,
): RegionGroup[] {
  const map = new Map<string, Framework[]>();
  for (const f of frameworks) {
    const region = regionOf(f);
    const list = map.get(region);
    if (list) list.push(f);
    else map.set(region, [f]);
  }
  return REGION_ORDER.filter((r) => map.has(r)).map((region) => ({
    region,
    frameworks: map.get(region) ?? [],
  }));
}

/* ── Lookups ───────────────────────────────────────────────────────────────── */

/** O(1) entry index, built once, keyed by `frameworkId::dimensionId`. */
const entryIndex = new Map<string, Entry>(
  data.entries.map((e) => [`${e.frameworkId}::${e.dimensionId}`, e]),
);

export function findEntry(
  frameworkId: string,
  dimensionId: string,
): Entry | undefined {
  return entryIndex.get(`${frameworkId}::${dimensionId}`);
}

const frameworkIndex = new Map<string, Framework>(
  data.frameworks.map((f) => [f.id, f]),
);

export function findFramework(id: string): Framework | undefined {
  return frameworkIndex.get(id);
}
