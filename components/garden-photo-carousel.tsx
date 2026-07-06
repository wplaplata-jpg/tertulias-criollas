"use client";

import { useState } from "react";

const gardenPhotos = [
  "/jardin/118.jpg",
  "/jardin/119.jpg",
  "/jardin/120.jpg",
  "/jardin/121.jpg",
  "/jardin/121a.jpg",
  "/jardin/122.jpg",
  "/jardin/123.jpg",
  "/jardin/124.jpg",
  "/jardin/125.jpg",
  "/jardin/20210527_130406.jpg"
] as const;

type GardenPhotoCarouselProps = {
  label: string;
  initialIndex?: number;
};

export function GardenPhotoCarousel({
  label,
  initialIndex = 0
}: GardenPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex % gardenPhotos.length
  );
  const currentPhoto = gardenPhotos[currentIndex];

  function goToPrevious() {
    setCurrentIndex((index) =>
      index === 0 ? gardenPhotos.length - 1 : index - 1
    );
  }

  function goToNext() {
    setCurrentIndex((index) =>
      index === gardenPhotos.length - 1 ? 0 : index + 1
    );
  }

  return (
    <section className="reveal-on-scroll bg-stone-950 px-4 pb-20 min-[420px]:px-6 sm:pb-28 lg:pb-36">
      <div className="mx-auto max-w-6xl">
        <div className="relative h-[260px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_35%_25%,rgba(245,222,179,0.18),transparent_34%),linear-gradient(135deg,rgba(68,50,35,0.9),rgba(6,6,6,1))] shadow-[0_30px_90px_rgba(0,0,0,0.38)] min-[420px]:h-[320px] sm:h-[440px] sm:rounded-[2rem] lg:h-[540px]">
          <div
            role="img"
            aria-label={label}
            className="absolute inset-0 bg-cover bg-center transition duration-700"
            style={{ backgroundImage: `url(${currentPhoto})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.42))]" />

          <button
            type="button"
            aria-label="Foto anterior"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-stone-100 backdrop-blur-md transition hover:border-white/40 hover:bg-black/55 sm:left-5 sm:h-12 sm:w-12"
          >
            <span className="text-3xl leading-none">‹</span>
          </button>

          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={goToNext}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-stone-100 backdrop-blur-md transition hover:border-white/40 hover:bg-black/55 sm:right-5 sm:h-12 sm:w-12"
          >
            <span className="text-3xl leading-none">›</span>
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-stone-200 backdrop-blur-md">
            {currentIndex + 1} / {gardenPhotos.length}
          </div>
        </div>
      </div>
    </section>
  );
}
