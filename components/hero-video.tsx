"use client";

import { useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  async function toggleSound() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const shouldUnmute = video.muted;
    video.muted = !shouldUnmute;
    setIsMuted(video.muted);

    if (shouldUnmute) {
      await video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
      });
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted={isMuted}
        playsInline
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <a
        href="https://www.youtube.com/watch?v=olAYgxbyJsQ"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-6 left-6 z-20 rounded-full border border-white/20 bg-black/45 px-4 py-2 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.18em] text-stone-100 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-black/65 sm:bottom-8 sm:left-8"
      >
        Ver video completo
      </a>

      <button
        type="button"
        aria-pressed={!isMuted}
        onClick={toggleSound}
        className="absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-black/45 px-4 py-2 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.18em] text-stone-100 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-black/65 sm:bottom-8 sm:right-8"
      >
        {isMuted ? "Activar sonido" : "Silenciar"}
      </button>
    </>
  );
}
