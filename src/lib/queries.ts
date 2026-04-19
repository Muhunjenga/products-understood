import { getSanityClient } from "./sanity";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PortableTextChild {
  _type: "span";
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: string;
  children: PortableTextChild[];
  markDefs?: unknown[];
}

export interface StoryCard {
  _id: string;
  title: string;
  slug: string;
  company: string;
  categories: string[];
  illustrationUrl: string | null;
  audioUrl: string | null;
  audioDuration: number | null; // seconds
  readTime: string;             // e.g. "17 min read"
  publishedAt: string | null;
}

export interface StoryFull extends StoryCard {
  body: PortableTextBlock[];
  chapters: { id: string; label: string }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive reading time from Portable Text body (~200 wpm) */
function calcReadTime(body: PortableTextBlock[]): string {
  const text = body
    .filter((b) => b._type === "block")
    .flatMap((b) => b.children?.map((c) => c.text) ?? [])
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/** Extract h2/h3 headings as chapter nav items with auto-generated ids */
export function extractChapters(
  body: PortableTextBlock[]
): { id: string; label: string }[] {
  return body
    .filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3"))
    .map((b) => {
      const label = b.children?.map((c) => c.text).join("") ?? "";
      const id = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { id, label };
    });
}

/** Format seconds → "27 min" */
export function formatAudioDuration(seconds: number | null): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

// ── Raw Sanity shape (after GROQ projection) ──────────────────────────────────

interface RawStory {
  _id: string;
  title: string;
  slug: { current: string };
  company: string;
  categories: string[] | null;
  illustrationUrl: string | null;
  audioUrl: string | null;
  audioDuration: number | null;
  body: PortableTextBlock[];
  publishedAt: string | null;
}

function mapCard(raw: RawStory): StoryCard {
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug.current,
    company: raw.company,
    categories: raw.categories ?? [],
    illustrationUrl: raw.illustrationUrl ?? null,
    audioUrl: raw.audioUrl ?? null,
    audioDuration: raw.audioDuration ?? null,
    readTime: calcReadTime(raw.body ?? []),
    publishedAt: raw.publishedAt ?? null,
  };
}

// ── GROQ projection ───────────────────────────────────────────────────────────

// asset->url gives the full Sanity CDN URL directly — no manual URL building needed
const CARD_FIELDS = `
  _id,
  title,
  slug,
  company,
  categories,
  "illustrationUrl": illustration.asset->url,
  "audioUrl": audio.asset->url,
  "audioDuration": audio.asset->metadata.duration,
  body,
  publishedAt
`;

// ── Queries ───────────────────────────────────────────────────────────────────

/** All published stories for the homepage grid */
export async function getAllStories(): Promise<StoryCard[]> {
  const raw = await getSanityClient().fetch<RawStory[]>(
    `*[_type == "story" && defined(slug.current)] | order(publishedAt desc) { ${CARD_FIELDS} }`,
    {},
    { cache: "no-store" }
  );
  return raw.map(mapCard);
}

/** Single story by slug for player + reader pages */
export async function getStoryBySlug(slug: string): Promise<StoryFull | null> {
  const raw = await getSanityClient().fetch<RawStory | null>(
    `*[_type == "story" && slug.current == $slug][0] { ${CARD_FIELDS} }`,
    { slug },
    { cache: "no-store" }
  );
  if (!raw) return null;

  const body = raw.body ?? [];
  return {
    ...mapCard(raw),
    body,
    chapters: extractChapters(body),
  };
}

/** Stories sharing at least one category with the given story, excluding itself */
export async function getSimilarStories(
  currentSlug: string,
  categories: string[],
  limit = 3
): Promise<StoryCard[]> {
  if (categories.length === 0) {
    const raw = await getSanityClient().fetch<RawStory[]>(
      `*[_type == "story" && defined(slug.current) && slug.current != $currentSlug] | order(publishedAt desc) [0...$limit] { ${CARD_FIELDS} }`,
      { currentSlug, limit },
      { cache: "no-store" }
    );
    return raw.map(mapCard);
  }
  const raw = await getSanityClient().fetch<RawStory[]>(
    `*[_type == "story" && defined(slug.current) && slug.current != $currentSlug && count((categories[])[@ in $categories]) > 0] | order(publishedAt desc) [0...$limit] { ${CARD_FIELDS} }`,
    { currentSlug, categories, limit },
    { cache: "no-store" }
  );
  return raw.map(mapCard);
}

/** All slugs for static route generation */
export async function getAllSlugs(): Promise<string[]> {
  const rows = await getSanityClient().fetch<{ slug: { current: string } }[]>(
    `*[_type == "story" && defined(slug.current)]{ slug }`,
    {},
    { cache: "no-store" }
  );
  return rows.map((r) => r.slug.current);
}
