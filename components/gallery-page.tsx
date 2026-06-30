import { GalleryLightbox } from "@/components/gallery-lightbox";
import type { Gallery } from "@/lib/gallery";
import Link from "next/link";

type GalleryPageProps = {
  gallery: Gallery;
};

export function GalleryPage({ gallery }: GalleryPageProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20 text-stone-100 sm:py-28">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
            Galería
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-[0.95] tracking-[0.065em] text-stone-100 sm:text-6xl md:text-7xl">
            {gallery.title}
          </h1>
          <p className="mt-7 text-base leading-8 text-stone-300 sm:text-lg sm:leading-9">
            {gallery.description}
          </p>
        </div>

        <div className="mt-14">
          <GalleryLightbox images={gallery.images} />
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/[0.05] px-7 py-3 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12]"
          >
            Volver a la página principal
          </Link>
        </div>
      </section>
    </main>
  );
}
