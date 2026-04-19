# Homepage Redesign — Change Log

**Date:** 2026-04-16  
**Figma reference frames:** `6175:757` (hero) and `6169:634` (stories)

---

## What changed

### `src/app/page.tsx` — full rewrite

**Before:** Single scrolling page. Fixed `Orange-Gradient-Background.png` behind everything. Hero text + search + cards in one `<main>` block. No scroll animation.

**After:** Two discrete sections with a sticky-scroll "slide over" effect:

1. **Hero section** (`<section class="hero-section">`)
   - `position: sticky; top: 0; height: 100vh; z-index: 1`
   - Background: `/images/8.jpg` (cyclist / galaxy field image) with `rgba(0,0,0,0.63)` overlay
   - `<Nav />` at top
   - Headline "PRODUCT UNDERSTOOD" — Inter SemiBold 38.222px, letter-spacing 22.93px, `rgba(255,255,255,0.84)`, at top 47.6% of viewport
   - Body copy — Geist 16px, `#71717a`, at top 72.9%, left-anchored per Figma at `calc(79.17% − 226px)` with width 464px
   - "Explore Stories" button — 146×42px, `border: 1px solid #333`, border-radius 24px, white text; smooth-scrolls to section 2 on click

2. **Stories section** (`<section class="stories-section">`)
   - `position: relative; z-index: 2; border-radius: 20px 20px 0 0; box-shadow: 0 -40px 100px rgba(0,0,0,0.95)`
   - Background: `Orange-Gradient-Background.png` with `rgba(0,0,0,0.86)` overlay (darker than before)
   - Search bar with search icon (SVG inline), pill shape, `#71717a` placeholder
   - Horizontal divider (1px, `#333`) 44px below search
   - Category filter tabs: All / Consumer Products / Developer Tools / Design — Inter 14px, "All" active with `rgba(255,255,255,0.07)` bg
   - Story card grid — same `<StoryCard>` components, 4 up, gap 33.7px, wrapped
   - Footer — Geist Medium 14px `#71717a`

**Scroll animation mechanics:** As the user scrolls, the hero stays pinned (`position: sticky`) while the stories section (z-index 2) rises from below and physically slides over the hero — like the top strip on [elyse-residence-dev.webflow.io](https://elyse-residence-dev.webflow.io/).

**Removed:** The fixed `<Image>` background wrapper that was present at the top of the old page. Each section now manages its own background independently.

---

### `src/app/globals.css`

**Added classes:**
- `.hero-section` — sticky, full-height, z-index 1
- `.hero-headline` — absolute, percentage-based vertical position, Inter SemiBold, wide letter-spacing
- `.hero-body` — absolute, Figma's right-anchored position (`calc(79.17% − 226px)`)
- `.hero-cta` — absolute, centered at bottom of hero frame
- `.stories-section` — relative, z-index 2, rounded top corners, drop shadow
- Mobile overrides (`@media max-width: 768px`) for hero headline, body, cta — centred stacked layout

**Modified:**
- `html { height: 100% }` + `body { min-height: 100% }` — was `html, body { height: 100% }`. Change ensures the body grows with content, which is required for `position: sticky` to scroll correctly.

---

## Pending manual step

The hero background image (`/images/8.jpg`) must be placed at:
```
public/images/8.jpg
```
This is the cyclist/galaxy-field image attached to the Figma frame `6175:759` ("_ (8) 1"). Until this file is present the hero will show a transparent/broken image background; all other sections are unaffected.

---

## How to roll back

Restore these two files to their previous state:

### `src/app/page.tsx` — previous version
```tsx
"use client";

import { Nav } from "@/components/Nav";
import { StoryCard } from "@/components/StoryCard";
import { StoryCard as StoryCardType } from "@/lib/queries";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [stories, setStories] = useState<StoryCardType[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(setStories)
      .catch(() => {});
  }, []);

  const filtered = query.trim()
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.company.toLowerCase().includes(query.toLowerCase())
      )
    : stories;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
        <Image src="/images/Orange-Gradient-Background.png" alt="" fill style={{ objectFit: "cover" }} unoptimized priority />
      </div>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p className="hero-text" style={{
            marginTop: 65, width: 417, textAlign: "center",
            fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif",
            fontSize: 14, fontWeight: 400,
            color: "rgba(255,255,255,0.65)", lineHeight: 1.65,
          }}>
            Deep dives into the decisions, people, and turning points
            behind the world&apos;s most important products, told as stories you
            can read or listen to.
          </p>

          <div className="content-block" style={{ width: 1041, marginTop: 45 }}>
            <input
              type="text"
              placeholder="Search stories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              style={{
                display: "block", width: 271, height: 42,
                border: "1px solid #333", borderRadius: 24,
                padding: "8px 12px",
                background: "transparent", color: "#ffffff",
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                outline: "none",
              }}
            />

            <div className="cards-row" style={{ display: "flex", gap: 33.7, marginTop: 36 }}>
              {filtered.length > 0 ? (
                filtered.map((story) => (
                  <StoryCard
                    key={story._id}
                    company={story.company}
                    title={story.title}
                    readTime={story.readTime}
                    illustrationUrl={story.illustrationUrl}
                    href={`/${story.slug}`}
                  />
                ))
              ) : stories.length === 0 ? (
                <>
                  <StoryCard empty />
                  <StoryCard empty />
                  <StoryCard empty />
                  <StoryCard empty />
                </>
              ) : (
                <p style={{ color: "#71717a", fontSize: 14, fontFamily: '"Inter", system-ui, sans-serif', paddingTop: 8 }}>
                  No stories match &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </div>
        </main>

        <footer style={{ padding: "40px 0 36px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            copyright @ 2026. Product understood
          </p>
        </footer>
      </div>
    </>
  );
}
```

### `src/app/globals.css` — revert these two changes:
1. Change `body { min-height: 100% }` back to `html, body { height: 100% }` (combined rule)
2. Remove all CSS between `/* ─── Homepage scroll animation ─── */` and `/* ─── Responsive layout classes ─── */`
3. Remove the mobile hero overrides (`hero-headline`, `hero-body`, `hero-cta`) from the `@media (max-width: 768px)` block
