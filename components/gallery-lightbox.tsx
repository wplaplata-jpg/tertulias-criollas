"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/gallery";

type GalleryLightboxProps = {
  images: readonly GalleryImage[];
};

export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelectedImage(image)}
            className="group relative h-56 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03] text-left shadow-[0_24px_70px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-white/25 min-[420px]:h-64 sm:h-72 sm:rounded-[1.5rem]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-16 sm:px-4 sm:py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-3 top-4 rounded-full border border-white/20 bg-white/[0.06] px-3 py-2 font-[var(--font-heading)] text-xs uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/[0.12] sm:right-5 sm:top-5 sm:px-4 sm:text-sm sm:tracking-[0.18em]"
          >
            Cerrar
          </button>
          <div
            className="relative h-[68vh] w-full max-w-5xl overflow-hidden rounded-[1.25rem] border border-white/15 bg-black sm:h-[78vh] sm:rounded-[1.5rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
