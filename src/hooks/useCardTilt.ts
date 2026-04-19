import { useRef } from "react";

export function useCardTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const illustration = illustrationRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;

    card.style.transition = "none";
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5)";

    if (illustration) {
      illustration.style.transition = "none";
      illustration.style.transform = `translate(${((x - cx) / cx) * -8}px, ${((y - cy) / cy) * -8}px)`;
    }

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      glare.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const illustration = illustrationRef.current;
    const glare = glareRef.current;
    const spring =
      "transform 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)";

    if (card) {
      card.style.transition = `${spring}, box-shadow 400ms ease`;
      card.style.transform =
        "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.boxShadow =
        "0px 8.995px 44.976px 0px rgba(0,0,0,0.2)";
    }
    if (illustration) {
      illustration.style.transition = spring;
      illustration.style.transform = "translate(0px, 0px)";
    }
    if (glare) {
      glare.style.transition = "opacity 300ms ease";
      glare.style.opacity = "0";
    }
  };

  return {
    cardRef,
    illustrationRef,
    glareRef,
    handleMouseMove,
    handleMouseLeave,
  };
}
