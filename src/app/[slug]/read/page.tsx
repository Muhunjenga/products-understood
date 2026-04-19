"use client";

import { Nav } from "@/components/Nav";
import { PageBackground } from "@/components/PageBackground";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { PortableTextBlock, StoryFull, formatAudioDuration } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";

// ── Waveform icon ─────────────────────────────────────────────────────────────

function WaveformIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="6" width="2" height="4" rx="1" fill="#71717a" />
      <rect x="4.5" y="4" width="2" height="8" rx="1" fill="#71717a" />
      <rect x="8" y="2" width="2" height="12" rx="1" fill="#71717a" />
      <rect x="11.5" y="4" width="2" height="8" rx="1" fill="#71717a" />
    </svg>
  );
}

// ── Chapter nav ───────────────────────────────────────────────────────────────

function ChapterNav({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const threshold = window.innerHeight * 0.3;
      let current = chapters[0]?.id ?? "";
      for (const { id } of chapters) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [chapters]);

  return (
    <nav style={{ position: "sticky", top: 80, width: 160, flexShrink: 0 }}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {chapters.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id} style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{
                width: 2, flexShrink: 0, borderRadius: 1, marginRight: 10,
                background: isActive ? "#ffffff" : "rgba(255,255,255,0.1)",
                transition: "background 200ms ease",
              }} />
              <a
                href={`#${id}`}
                onClick={() => setActiveId(id)}
                style={{
                  flex: 1, padding: "6px 0",
                  fontSize: 11,
                  fontFamily: '"Inter", system-ui, sans-serif',
                  color: isActive ? "#ffffff" : "#71717a",
                  textDecoration: "none",
                  lineHeight: 1.45,
                  transition: "color 200ms ease",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ── Portable Text components ──────────────────────────────────────────────────

function makeComponents(chapters: { id: string; label: string }[]) {
  const chapterIds = new Set(chapters.map((c) => c.id));

  return {
    block: {
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p style={{ marginBottom: 20, color: "rgba(255,255,255,0.88)", fontFamily: '"Geist", system-ui, sans-serif', fontSize: 15, lineHeight: 1.75 }}>{children}</p>
      ),
      h2: ({ children, value }: { children?: React.ReactNode; value?: PortableTextBlock }) => {
        const text = value?.children?.map((c) => c.text).join("") ?? "";
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return (
          <h2 id={chapterIds.has(id) ? id : undefined} style={{
            fontFamily: '"Haas Grot Disp R Trial", Georgia, serif',
            fontSize: 20, fontWeight: 400, color: "#ffffff",
            marginTop: 52, marginBottom: 20, lineHeight: 1.3, scrollMarginTop: 80,
          }}>{children}</h2>
        );
      },
      h3: ({ children, value }: { children?: React.ReactNode; value?: PortableTextBlock }) => {
        const text = value?.children?.map((c) => c.text).join("") ?? "";
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return (
          <h2 id={chapterIds.has(id) ? id : undefined} style={{
            fontFamily: '"Haas Grot Disp R Trial", Georgia, serif',
            fontSize: 20, fontWeight: 400, color: "#ffffff",
            marginTop: 52, marginBottom: 20, lineHeight: 1.3, scrollMarginTop: 80,
          }}>{children}</h2>
        );
      },
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong style={{ fontWeight: 600, color: "#ffffff" }}>{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>{children}</em>
      ),
    },
  };
}

// ── Reader inner ──────────────────────────────────────────────────────────────

function ReaderInner({ story }: { story: StoryFull }) {
  const progress = useReadingProgress();
  const listenDuration = story.audioDuration
    ? formatAudioDuration(story.audioDuration)
    : story.readTime;

  const components = makeComponents(story.chapters);

  return (
    <div className="bg-publication" style={{ minHeight: "100vh" }}>
      <PageBackground />

      {/* Reading progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 50, background: "#1a1a1a" }}>
        <div className="progress-fill" style={{ height: "100%", width: `${progress}%`, transition: "width 100ms linear" }} />
      </div>

      <Nav />

      <main style={{ maxWidth: 783, margin: "0 auto", padding: "40px 24px 120px" }}>
        {/* Story header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 56 }}>
          {/* Artwork card */}
          <div style={{ flexShrink: 0, position: "relative", width: 113, height: 113, borderRadius: 16, overflow: "hidden", boxShadow: "0px 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
            <Image src="/images/Orange-Gradient-Background.png" alt="" fill style={{ objectFit: "cover" }} unoptimized />
            <div style={{ position: "absolute", inset: 0, background: "rgba(4,2,1,0.42)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {story.illustrationUrl ? (
                <Image src={story.illustrationUrl} alt={story.company} width={88} height={88}
                  style={{ objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }} unoptimized />
              ) : (
                <div style={{ width: 88, height: 88, background: "rgba(255,255,255,0.04)", borderRadius: 12 }} />
              )}
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: "1px solid rgba(255,255,255,0.09)", pointerEvents: "none" }} />
          </div>

          {/* Title + listen button */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, background: "rgba(217,102,252,0.2)", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontFamily: '"Inter", system-ui, sans-serif', color: "#ffffff" }}>{story.company}</span>
              </div>
              <h1 style={{ fontFamily: '"Haas Grot Disp R Trial", Georgia, serif', fontSize: 28, fontWeight: 400, color: "#ffffff", lineHeight: 1.25, maxWidth: 440 }}>
                {story.title}
              </h1>
            </div>
            <Link href={`/${story.slug}`} className="pill-btn" style={{ alignSelf: "flex-start" }}>
              <WaveformIcon />
              Listen Instead
            </Link>
          </div>
        </div>

        {/* Body with sidebar */}
        <div className="read-body" style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
          {/* Sidebar — hidden on mobile */}
          {story.chapters.length > 0 && (
            <div className="chapter-sidebar" style={{ alignSelf: "stretch" }}>
              <ChapterNav chapters={story.chapters} />
            </div>
          )}

          {/* Article */}
          <article style={{ flex: 1, maxWidth: 646 }}>
            <PortableText value={story.body} components={components as any} />
          </article>
        </div>
      </main>
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────

export default function StoryReadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [story, setStory] = useState<StoryFull | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/stories/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStory)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return (
    <div className="bg-publication" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PageBackground />
      <p style={{ color: "#71717a", fontFamily: '"Inter", system-ui, sans-serif' }}>Story not found.</p>
    </div>
  );

  if (!story) return (
    <div className="bg-publication" style={{ minHeight: "100vh" }}>
      <PageBackground />
      <Nav />
    </div>
  );

  return <ReaderInner story={story} />;
}
