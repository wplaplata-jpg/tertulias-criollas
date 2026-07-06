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
        className="absolute inset-0 h-full w-full object-cover object-[52%_44%] min-[420px]:object-[50%_45%] sm:object-[50%_47%] md:object-[50%_45%] xl:object-center"
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
        className="absolute bottom-4 left-3 z-20 flex min-h-10 w-[calc(50vw-1rem)] max-w-[10.5rem] items-center justify-center rounded-full border border-white/20 bg-black/45 px-2.5 py-2 text-center font-[var(--font-heading)] text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-stone-100 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-black/65 min-[380px]:text-[10px] min-[420px]:bottom-5 min-[420px]:left-4 min-[420px]:min-h-11 min-[420px]:w-auto min-[420px]:max-w-none min-[420px]:px-4 min-[420px]:text-[11px] min-[420px]:tracking-[0.16em] sm:bottom-8 sm:left-8 sm:min-h-12 sm:px-5 sm:py-2.5 sm:text-xs md:px-6 md:py-3 md:text-sm md:tracking-[0.18em] lg:bottom-10 lg:left-10"
      >
        English version
      </a>

      <button
        type="button"
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        aria-pressed={!isMuted}
        onClick={toggleSound}
        title={isMuted ? "Activar sonido" : "Silenciar"}
        className="absolute bottom-4 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-stone-100 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-black/65 min-[420px]:bottom-5 min-[420px]:right-4 min-[420px]:h-11 min-[420px]:w-11 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12 lg:bottom-10 lg:right-10"
      >
        <span className="relative flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-full w-full"
            fill="none"
          >
            <path
              d="M4.75 9.25h3.7l5.05-4.1v13.7l-5.05-4.1h-3.7v-5.5Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.45"
            />
            {!isMuted ? (
              <>
                <path
                  d="M16.5 9.15a4.1 4.1 0 0 1 0 5.7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.35"
                />
                <path
                  d="M18.85 6.95a7.25 7.25 0 0 1 0 10.1"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
              </>
            ) : null}
          </svg>
          {isMuted ? (
            <span className="absolute h-[1.35px] w-7 rotate-45 rounded-full bg-stone-100" />
          ) : null}
        </span>
      </button>
    </>
  );
}
