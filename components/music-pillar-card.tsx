"use client";

import {
  HERO_AUDIO_COORDINATION_EVENT,
  type HeroAudioCoordinationDetail
} from "@/lib/hero-audio-events";
import { useEffect, useRef, useState } from "react";

type MusicPillarCardProps = {
  title: string;
  description: string;
  href: string;
};

function MusicIcon() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e5d2a3]/30 bg-[radial-gradient(circle_at_center,rgba(229,210,163,0.12),rgba(255,255,255,0.02)_58%,transparent)] shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:h-24 sm:w-24">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e5d2a3]/10 sm:h-20 sm:w-20">
        <svg
          viewBox="0 0 72 72"
          aria-hidden="true"
          className="h-12 w-12 text-[#e5d2a3] sm:h-16 sm:w-16"
          fill="none"
        >
          <path
            d="M39.5 10.5v39.8c0 6.2-5.1 11.2-11.3 11.2s-11.3-5-11.3-11.2 5.1-11.2 11.3-11.2c4.3 0 8.1 2.4 10 5.9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
          <path
            d="M39.5 10.5c8.4 1.7 13.6 5.6 13.6 11.2 0 4.6-3.5 8.3-9.2 10.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
          <path
            d="M23 22.4h27.5M22 29.2h24M22 36h18.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.85"
            opacity="0.52"
          />
          <path
            d="M19 12c-2.7 2-4.3 4.6-4.3 7.5M55.8 52.2c2.4-2.1 3.8-4.6 3.8-7.3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.85"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

function dispatchMusicVideoState(musicVideoActive: boolean) {
  window.dispatchEvent(
    new CustomEvent<HeroAudioCoordinationDetail>(
      HERO_AUDIO_COORDINATION_EVENT,
      {
        detail: { musicVideoActive }
      }
    )
  );
}

export function MusicPillarCard({
  title,
  description
}: MusicPillarCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerTypeRef = useRef<string>("mouse");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isActive) {
      video.muted = false;
      video.volume = 1;
      dispatchMusicVideoState(true);

      void video.play().catch(() => {
        video.muted = true;
        void video.play();
      });
      return;
    }

    dispatchMusicVideoState(false);
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // Some browsers can reject seeking before metadata is available.
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      dispatchMusicVideoState(false);
    };
  }, []);

  return (
    <article
      aria-pressed={isActive}
      className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-7 text-center transition duration-300 hover:scale-[1.01] hover:bg-white/[0.05] sm:rounded-[2rem] sm:px-6 sm:py-10"
      role="button"
      tabIndex={0}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setIsActive(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          setIsActive(false);
        }
      }}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
      }}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      onClick={() => {
        if (pointerTypeRef.current !== "mouse") {
          setIsActive((current) => !current);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsActive((current) => !current);
        }
      }}
    >
      <video
        ref={videoRef}
        aria-hidden={!isActive}
        className={`absolute inset-0 h-full w-full object-cover transition duration-300 ${
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        loop
        playsInline
        preload="metadata"
      >
        <source src="/galeria/musica/musica.mp4" type="video/mp4" />
      </video>

      <div
        className={`relative z-10 transition duration-300 ${
          isActive ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="mb-5 flex justify-center sm:mb-8">
          <MusicIcon />
        </div>
        <h3 className="font-[var(--font-heading)] text-[1.7rem] font-semibold leading-[1] tracking-[0.055em] text-stone-100 sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 text-[15px] leading-7 text-stone-300 sm:text-base sm:leading-8">
          {description}
        </p>
      </div>
    </article>
  );
}
