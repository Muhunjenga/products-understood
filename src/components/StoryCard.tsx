"use client";

import { useCardTilt } from "@/hooks/useCardTilt";
import Image from "next/image";
import Link from "next/link";

interface StoryCardProps {
  company?: string;
  title?: string;
  readTime?: string;
  /** Local public path e.g. /images/figma.png */
  illustration?: string;
  /** Full URL from Sanity CDN — takes priority over illustration */
  illustrationUrl?: string | null;
  empty?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function StoryCard({
  company,
  title,
  readTime,
  illustration,
  illustrationUrl,
  empty = false,
  href,
  onClick,
  className,
}: StoryCardProps) {
  const imgSrc = illustrationUrl ?? illustration ?? null;
  const { cardRef, illustrationRef, glareRef, handleMouseMove, handleMouseLeave } =
    useCardTilt();

  const card = (
    <div
      ref={cardRef}
      className={`story-card${className ? ` ${className}` : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        position: "relative",
        flexShrink: 0,
        borderRadius: 24,
        overflow: "hidden",
        // Figma shadow from the design
        boxShadow: "0px 8.995px 44.976px 0px rgba(0,0,0,0.45)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        cursor: href || onClick ? "pointer" : "default",
        opacity: empty ? 0.3 : 1,
      }}
    >
      {/* ── Layer 1: Orange gradient image — card background ── */}
      <Image
        src="/images/Orange-Gradient-Background.png"
        alt=""
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        unoptimized
        priority
      />

      {/* ── Layer 2: Dark overlay — "Liquid Glass" darkness ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          // Slightly lighter than before so the warm glow breathes through
          background: "rgba(8, 4, 1, 0.72)",
        }}
      />

      {/* ── Layer 3: Glare (cursor-tracked via useCardTilt) ── */}
      <div
        ref={glareRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          borderRadius: 24,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease",
        }}
      />

      {!empty && (
        <>
          {/* ── Layer 4: Pill illustration ──
              Figma: x=74, y=25, w=87, h=87 within a 235×235 card.
              Horizontally centered (74 + 87/2 = 117.5 = 235/2).
              Top at y=25 → 25px padding from card top.             ── */}
          <div
            ref={illustrationRef}
            style={{
              position: "absolute",
              top: 25,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              willChange: "transform",
            }}
          >
            {imgSrc && (
              <Image
                src={imgSrc}
                alt={company ?? "Story"}
                width={87}
                height={87}
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
                }}
                unoptimized
              />
            )}
          </div>

          {/* ── Layer 5: Content — no separator, no backdrop blur ──
              Figma: Frame 8 at x=35, y=127, w=166, h=84.
              Content flows directly on the card surface — no dividing line.
              Padding: 35px each side (235-166)/2=34.5≈35.
              Bottom: card is 235, content ends at 211 → 24px bottom space.
              ── */}
          <div
            className="card-content"
            style={{
              position: "absolute",
              top: 127,
              left: 35,
              right: 35,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* Company tag pill — Frame 6: w=52.87, h=19, centered in 166px content */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1px 9px",
                borderRadius: 3.3,
                background: "rgba(217, 102, 252, 0.22)",
                marginBottom: 8, // gap between tag (y=0) and title (y=27): 8px
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                  fontSize: 9.5,
                  fontWeight: 400,
                  color: "#ffffff",
                  lineHeight: "17px",
                  letterSpacing: "0.2px",
                }}
              >
                {company}
              </span>
            </div>

            {/* Title — y=27, height=30 (2 lines × ~15px) */}
            <p
              style={{
                fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif",
                fontSize: 11.5,
                fontWeight: 400,
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.5,
                margin: 0,
                marginBottom: 10, // gap between title bottom (y=57) and readtime (y=67): 10px
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
                width: "100%",
              }}
            >
              {title}
            </p>

            {/* Read time — y=67, height=17 */}
            <p
              style={{
                fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
                fontSize: 9.5,
                color: "#71717a",
                textAlign: "center",
                margin: 0,
                lineHeight: "17px",
              }}
            >
              {readTime}
            </p>
          </div>
        </>
      )}

      {/* ── Inset border rim (subtle glass edge) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0, width: "100%" }}>
        {card}
      </Link>
    );
  }

  return card;
}
