"use client";

import { Nav } from "@/components/Nav";
import { StoryCard } from "@/components/StoryCard";
import { StoryCard as StoryCardType } from "@/lib/queries";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

function WritingText({ text }: { text: string }) {
  const words = text.split(" ");
  let animIdx = 0;

  return (
    <>
      {words.map((word, wordIdx) => (
        <Fragment key={wordIdx}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char) => {
              const delay = 0.1 + animIdx++ * 0.055;
              return (
                <span
                  key={char + animIdx}
                  style={{
                    display: "inline-block",
                    animation: `hero-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIdx < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const CATEGORIES = ["All", "Consumer Products", "Developer Tools", "Design", "B2B", "Fintech"];

export default function HomePage() {
  const [stories, setStories] = useState<StoryCardType[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [storiesVisible, setStoriesVisible] = useState(false);
  const storiesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(setStories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = storiesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStoriesVisible(true); },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bySearch = query.trim()
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.company.toLowerCase().includes(query.toLowerCase())
      )
    : stories;

  const filtered =
    activeCategory === "All"
      ? bySearch
      : bySearch.filter((s) => s.categories?.includes(activeCategory));

  const scrollToStories = () => {
    storiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>

      {/* ─── SECTION 1: Hero ─────────────────────────────────────────────────
          sticky at top:0 — the stories section slides up over it on scroll  */}
      <section className="hero-section">

        {/* Background image — the "8" image (cyclist / galaxy field) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/8.jpg"
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center center" }}
            unoptimized
            priority
          />
          {/* Dark overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.78)" }} />
        </div>

        {/* Nav — fades in first via .hero-nav */}
        <div className="hero-nav">
          <Nav />
        </div>

        {/* Headline — positioning wrapper + animated h1 */}
        <div className="hero-headline-wrap">
          <h1 className="hero-headline"><WritingText text="PRODUCT UNDERSTOOD" /></h1>
        </div>

        {/* Body copy — positioning wrapper + animated div */}
        <div className="hero-body-wrap">
          <div className="hero-body">
            <p style={{ color: "#71717a", margin: 0 }}>
              Deep-dive audio narratives into the turning points and trade-offs
              of iconic products, told by the people who were in the room.
            </p>
            <p style={{ color: "rgba(255,255,255,0.84)", margin: "16px 0 0" }}>
              For Founders and Product teams actively building.
            </p>
          </div>
        </div>

        {/* CTA — positioning wrapper + animated button */}
        <div className="hero-cta-wrap">
          <button className="hero-cta" onClick={scrollToStories}>
            Explore Stories
          </button>
        </div>

      </section>

      {/* ─── SECTION 2: Stories ──────────────────────────────────────────────
          z-index 2, rounded top corners — slides over hero on scroll        */}
      <section className={`stories-section${storiesVisible ? " stories-visible" : ""}`} ref={storiesRef}>

        {/* CSS dark amber-glow + film grain background */}
        <div className="stories-bg" />

        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}>

          {/* Search bar — border-bottom lives on the label, making it a proper underline input */}
          <div style={{ paddingTop: 91, paddingBottom: 32, display: "flex", justifyContent: "center" }}>
            <div className="content-block stories-search-bar" style={{ width: 1041 }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "text",
                width: "100%",
                paddingBottom: 14,
                borderBottom: "1px solid #3a3a3a",
              }}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search stories"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#71717a",
                    fontSize: 14,
                    fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </label>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <div className="content-block stories-categories" style={{ width: 1041, display: "flex", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className="category-tab"
                  data-active={activeCategory === cat ? "true" : "false"}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Card grid */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 33 }}>
            <div className="content-block" style={{ width: 1041 }}>
              <div className="cards-row stories-cards" style={{ display: "flex", gap: 33.7, flexWrap: "wrap" }}>
                {filtered.length > 0 ? (
                  filtered.map((story) => (
                    <div key={story._id} className="card-wrapper">
                      <StoryCard
                        company={story.company}
                        title={story.title}
                        readTime={story.readTime}
                        illustrationUrl={story.illustrationUrl}
                        href={`/${story.slug}`}
                      />
                    </div>
                  ))
                ) : stories.length === 0 ? (
                  [0, 1, 2, 3].map((i) => (
                    <div key={i} className="card-wrapper">
                      <StoryCard empty />
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#71717a", fontSize: 14, fontFamily: '"Inter", system-ui, sans-serif', paddingTop: 8 }}>
                    No stories match &ldquo;{query}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer — copyright @ bottom of 1024px frame */}
          <footer style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "80px 0 46px",
          }}>
            <p style={{
              fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "#71717a",
              textAlign: "center",
            }}>
              copyright @ 2026. Product understood
            </p>
          </footer>

        </div>
      </section>

    </div>
  );
}
