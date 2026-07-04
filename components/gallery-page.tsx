import { GalleryLightbox } from "@/components/gallery-lightbox";
import type { Gallery } from "@/lib/gallery";
import Link from "next/link";

type GalleryPageProps = {
  gallery: Gallery;
};

export function GalleryPage({ gallery }: GalleryPageProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-14 text-stone-100 min-[420px]:px-6 sm:py-20 lg:py-28">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.35em]">
            Galería
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-4xl font-semibold leading-[1] tracking-[0.06em] text-stone-100 min-[420px]:text-5xl sm:text-6xl md:text-7xl">
            {gallery.title}
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-stone-300 sm:mt-7 sm:text-lg sm:leading-9">
            {gallery.description}
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          <GalleryLightbox images={gallery.images} />
        </div>

        <div className="mt-10 flex justify-center sm:mt-14">
          <Link
            href="/"
            className="w-full max-w-xs rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-center font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-stone-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12] sm:w-auto sm:max-w-none sm:px-7 sm:text-sm sm:tracking-[0.22em]"
          >
            Volver a la página principal
          </Link>
        </div>
      </section>
    </main>
  );
}
