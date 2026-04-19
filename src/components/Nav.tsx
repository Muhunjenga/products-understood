"use client";

import Link from "next/link";
import { useState } from "react";
import { SubscribeModal } from "./SubscribeModal";

interface NavProps {
  showSubscribe?: boolean;
}

// iOS-style share icon: tray with arrow pointing up
function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export function Nav({ showSubscribe = true }: NavProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard API unavailable
    }
  };

  return (
    <>
      <nav className="nav-root flex items-center justify-between w-full">
        <Link
          href="/"
          className="nav-logo font-haas text-white leading-none no-underline hover:opacity-80 transition-opacity"
          style={{ fontFamily: '"Haas Grot Disp R Trial", Georgia, serif' }}
        >
          Product Understood
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Share — copy page URL */}
          <button
            onClick={handleShare}
            aria-label="Copy link"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "transparent",
              border: "1px solid #333",
              color: "#71717a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color 200ms ease, color 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#555";
              (e.currentTarget as HTMLButtonElement).style.color = "#a1a1aa";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#333";
              (e.currentTarget as HTMLButtonElement).style.color = "#71717a";
            }}
          >
            <ShareIcon />
          </button>

          {showSubscribe && (
            <button className="pill-btn" style={{ width: 104 }} onClick={() => setShowModal(true)}>
              Subscribe
            </button>
          )}
        </div>
      </nav>

      {showModal && <SubscribeModal onClose={() => setShowModal(false)} />}

      {/* Toast */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: `translateX(-50%) translateY(${copied ? 0 : 12}px)`,
          opacity: copied ? 1 : 0,
          pointerEvents: "none",
          background: "rgba(20, 12, 4, 0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "10px 20px",
          color: "#ffffff",
          fontSize: 13,
          fontFamily: '"Inter", system-ui, sans-serif',
          letterSpacing: "0.01em",
          zIndex: 200,
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          transition: "opacity 200ms ease, transform 200ms ease",
          whiteSpace: "nowrap",
        }}
      >
        Link copied
      </div>
    </>
  );
}
