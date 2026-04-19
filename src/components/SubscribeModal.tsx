"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function SubscribeModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("subscribers").insert({ email });

    if (error) {
      if (error.code === "23505") {
        // unique violation — already subscribed
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } else {
      setStatus("success");
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#0c0702",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "36px 32px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        position: "relative",
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: "#71717a", padding: 4, lineHeight: 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✦</div>
            <p style={{
              fontFamily: '"Haas Grot Disp R Trial", Georgia, serif',
              fontSize: 20, fontWeight: 400, color: "#ffffff",
              marginBottom: 8,
            }}>You're in.</p>
            <p style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 13, color: "#71717a", lineHeight: 1.6,
            }}>We'll let you know when the next story drops.</p>
          </div>
        ) : (
          <>
            <p style={{
              fontFamily: '"Haas Grot Disp R Trial", Georgia, serif',
              fontSize: 22, fontWeight: 400, color: "#ffffff",
              marginBottom: 8, lineHeight: 1.3,
            }}>Get notified when<br />a new story drops.</p>
            <p style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 13, color: "#71717a", lineHeight: 1.6,
              marginBottom: 28,
            }}>No noise. Just a note when something new is ready to read or listen to.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                ref={inputRef}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, outline: "none",
                  color: "#ffffff",
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              />
              {errorMsg && (
                <p style={{ fontSize: 12, color: "#ef4444", fontFamily: '"Inter", system-ui, sans-serif' }}>{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: status === "loading" ? "rgba(217,119,6,0.5)" : "#d97706",
                  border: "none", borderRadius: 10,
                  color: "#ffffff", fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: 14, fontWeight: 500,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  transition: "background 200ms ease",
                }}
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
