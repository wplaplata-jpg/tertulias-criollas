"use client";

import { useEffect, useRef, useState } from "react";

type ImageSequencePillarCardProps = {
  title: string;
  description: string;
  type: "art" | "gastronomy";
  images: string[];
};

function Medallion({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e5d2a3]/30 bg-[radial-gradient(circle_at_center,rgba(229,210,163,0.12),rgba(255,255,255,0.02)_58%,transparent)] shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:h-24 sm:w-24">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e5d2a3]/10 sm:h-20 sm:w-20">
        {children}
      </div>
    </div>
  );
}

function SequenceIcon({ type }: { type: ImageSequencePillarCardProps["type"] }) {
  const iconClass = "h-12 w-12 text-[#e5d2a3] sm:h-16 sm:w-16";

  if (type === "art") {
    return (
      <Medallion>
        <svg
          viewBox="0 0 72 72"
          aria-hidden="true"
          className={iconClass}
          fill="none"
        >
          <path
            d="M18 48.5c4.2 4 11.1 6.7 18.8 6.7 13.2 0 23.8-8.6 23.8-19.3S50 16.5 36.8 16.5 13 25.2 13 36c0 3.5 1.9 5.7 5.1 5.7h4.6c3.2 0 5 3.8 3.1 6.3l-1.1 1.4c-1.4 1.8-4.1 1.9-6.7-.9Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.15"
          />
          <path
            d="M28 29h.1M37 25.5h.1M46 29h.1M49.8 39.2h.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M33.5 43.8 52 25.4M47.8 23.8l5.8 5.8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.1"
          />
          <path
            d="M18.4 21.5c2.5-4.4 7.4-7.7 13.3-9M55.2 51.4c-3 3.3-7.4 5.8-12.6 7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.85"
            opacity="0.4"
          />
        </svg>
      </Medallion>
    );
  }

  return (
    <Medallion>
      <svg
        viewBox="0 0 72 72"
        aria-hidden="true"
        className={iconClass}
        fill="none"
      >
        <path
          d="M24 14h24v10.5c0 6.6-5.4 12-12 12s-12-5.4-12-12V14Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.15"
        />
        <path
          d="M36 36.5V57M27.5 57h17M25.8 23h20.4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.15"
        />
        <path
          d="M54 15v42M59 15v42M54 28h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          opacity="0.78"
        />
        <path
          d="M17 15v42M13.5 15c0 8.5 7 8.5 7 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          opacity="0.78"
        />
        <path
          d="M21.2 11.8c-3.3 1.9-5.7 4.9-6.7 8.5M51.5 60.4c3.4-1.9 5.8-5 6.8-8.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="0.85"
          opacity="0.4"
        />
      </svg>
    </Medallion>
  );
}

export function ImageSequencePillarCard({
  title,
  description,
  type,
  images
}: ImageSequencePillarCardProps) {
  const pointerTypeRef = useRef<string>("mouse");
  const [isActive, setIsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [images.length, isActive]);

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
      <div
        aria-hidden={!isActive}
        className={`absolute inset-0 transition duration-500 ${
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              isActive && activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div
        className={`relative z-10 transition duration-300 ${
          isActive ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="mb-5 flex justify-center sm:mb-8">
          <SequenceIcon type={type} />
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
