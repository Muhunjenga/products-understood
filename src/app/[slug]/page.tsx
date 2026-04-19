"use client";

import { Nav } from "@/components/Nav";
import { PageBackground } from "@/components/PageBackground";
import { StoryCard } from "@/components/StoryCard";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { StoryCard as StoryCardType, StoryFull, formatAudioDuration } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

// ── Icons (same as before) ────────────────────────────────────────────────────

function RewindIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <g transform="scale(-1,1) translate(-24,0)">
        <path d="M12 5V2l4.5 3.5L12 9V6.5a5.5 5.5 0 1 0 5.5 5.5H19a7 7 0 1 1-7-7z" fill="rgba(255,255,255,0.9)" />
      </g>
      <text x="12" y="12" fontSize="6" fill="rgba(255,255,255,0.95)"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="700"
        textAnchor="middle" dominantBaseline="central">10</text>
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V2l4.5 3.5L12 9V6.5a5.5 5.5 0 1 0 5.5 5.5H19a7 7 0 1 1-7-7z" fill="rgba(255,255,255,0.9)" />
      <text x="12" y="12" fontSize="6" fill="rgba(255,255,255,0.95)"
        fontFamily="Inter, system-ui, sans-serif" fontWeight="700"
        textAnchor="middle" dominantBaseline="central">10</text>
    </svg>
  );
}

function ReadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function RingButton({ onClick, ariaLabel, children }: { onClick: () => void; ariaLabel: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{
      width: 46, height: 46, borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.22)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0, transition: "background 200ms ease, border-color 200ms ease",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.34)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.22)"; }}
    >{children}</button>
  );
}

function PlayPauseButton({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label={isPlaying ? "Pause" : "Play"} style={{
      position: "relative", width: 65, height: 65, borderRadius: "50%",
      background: "transparent", border: "1px solid rgba(255,255,255,0.24)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0, padding: 0, transition: "border-color 200ms ease",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.38)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.24)"; }}
    >
      <div style={{
        width: 55, height: 55, borderRadius: "50%",
        background: "rgba(12,7,2,0.96)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 8px rgba(0,0,0,0.6)",
      }}>
        {isPlaying ? (
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
            <rect x="2.5" y="1.5" width="4" height="13" rx="1.2" fill="#d97706" />
            <rect x="9.5" y="1.5" width="4" height="13" rx="1.2" fill="#d97706" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
            <path d="M5 2.5v11l9-5.5-9-5.5z" fill="#d97706" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ── Player inner (needs audioUrl at runtime) ──────────────────────────────────

function PlayerInner({ story }: { story: StoryFull }) {
  const { audioRef, isPlaying, currentTime, duration, togglePlay, skip, seek, formatTime } =
    useAudioPlayer(story.audioUrl ?? "");
  const [similarStories, setSimilarStories] = useState<StoryCardType[]>([]);

  useEffect(() => {
    fetch(`/api/stories/${story.slug}/similar`)
      .then((r) => r.json())
      .then(setSimilarStories)
      .catch(() => {});
  }, [story.slug]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  const displayDuration = story.audioDuration
    ? formatAudioDuration(story.audioDuration)
    : story.readTime;

  return (
    <div className="bg-publication">
      <PageBackground />
      <Nav />
      <audio ref={audioRef} src={story.audioUrl ?? ""} preload="metadata" />

      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 100 }}>
        <h1 style={{
          marginTop: 48, width: 254,
          fontFamily: '"Haas Grot Disp R Trial", Georgia, serif',
          fontSize: 24, fontWeight: 400, color: "#ffffff",
          textAlign: "center", lineHeight: 1.35,
        }}>
          {story.title}
        </h1>

        {/* Artwork card */}
        <div style={{
          marginTop: 32, position: "relative", width: 235, height: 235,
          borderRadius: 24, overflow: "hidden",
          boxShadow: "0px 16px 56px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}>
          <Image src="/images/Orange-Gradient-Background.png" alt="" fill style={{ objectFit: "cover" }} unoptimized />
          <div style={{ position: "absolute", inset: 0, background: "rgba(4,2,1,0.42)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {story.illustrationUrl ? (
              <Image src={story.illustrationUrl} alt={story.company} width={184} height={184}
                style={{ objectFit: "contain", filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.6))" }}
                unoptimized />
            ) : (
              <div style={{ width: 184, height: 184, background: "rgba(255,255,255,0.04)", borderRadius: 16 }} />
            )}
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 24, border: "1px solid rgba(255,255,255,0.09)", pointerEvents: "none" }} />
        </div>

        {/* Company + duration label */}
        <p style={{ marginTop: 12, fontSize: 12, color: "#71717a", fontFamily: '"Inter", system-ui, sans-serif' }}>
          {story.company} · {displayDuration}
        </p>

        {/* Player controls */}
        <div style={{ marginTop: 24, width: 206 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            {[formatTime(currentTime), formatTime(duration)].map((t, i) => (
              <span key={i} style={{ fontFamily: '"Sofia Pro", "Inter", system-ui, sans-serif', fontSize: 11, color: "#ffffff", letterSpacing: "0.17px", opacity: 0.85 }}>{t}</span>
            ))}
          </div>
          <div onClick={handleSeek} style={{ position: "relative", width: "100%", height: 14, display: "flex", alignItems: "center", cursor: "pointer" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "#454444", borderRadius: 1 }} />
            <div style={{ position: "absolute", left: 0, height: 7, width: `${progress}%`, background: "linear-gradient(90deg, #78350f 0%, #b45309 40%, #d97706 75%, #fbbf24 100%)", boxShadow: "0 0 8px rgba(251,191,36,0.5)", borderRadius: 4, transform: "translateY(-50%)", top: "50%" }} />
            {progress > 0 && (
              <div style={{ position: "absolute", left: `${progress}%`, top: "50%", transform: "translate(-50%, -50%)", width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 6px 2px rgba(251,191,36,0.7)", pointerEvents: "none" }} />
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 28 }}>
          <RingButton onClick={() => skip(-10)} ariaLabel="Rewind 10 seconds"><RewindIcon /></RingButton>
          <PlayPauseButton isPlaying={isPlaying} onToggle={togglePlay} />
          <RingButton onClick={() => skip(10)} ariaLabel="Forward 10 seconds"><ForwardIcon /></RingButton>
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href={`/${story.slug}/read`} className="pill-btn" style={{ width: 162 }}>
            <ReadIcon />
            Read Instead
          </Link>
        </div>

        {/* Similar Stories */}
        <div className="similar-stories-section" style={{ marginTop: 72, width: "100%", maxWidth: 1040, padding: "0 66px" }}>
          <h2 style={{ color: "#ffffff", fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif", fontSize: 20, fontWeight: 400, marginBottom: 32 }}>
            Similar Stories
          </h2>
          <div className="cards-row" style={{ display: "flex", gap: 33.7 }}>
            {similarStories.length > 0
              ? similarStories.map((s) => (
                  <StoryCard key={s._id} company={s.company} title={s.title} readTime={s.readTime}
                    illustrationUrl={s.illustrationUrl} href={`/${s.slug}`} />
                ))
              : [0, 1, 2].map((i) => <StoryCard key={i} empty />)
            }
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Page shell — fetches story client-side ────────────────────────────────────

export default function StoryPlayerPage({ params }: { params: Promise<{ slug: string }> }) {
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

  return <PlayerInner story={story} />;
}
