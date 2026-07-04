"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Reserva", href: "/reserva" },
  { label: "Contacto", href: "#contacto" }
] as const;

export function SiteHeader() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-40 w-full border-b px-4 py-3 transition-all duration-500 sm:px-6 sm:py-4 lg:px-8 ${
        hasScrolled
          ? "border-white/10 bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-x-2 gap-y-3 sm:gap-x-4">
        <Link
          href="#inicio"
          className="hidden justify-self-start font-[var(--font-heading)] text-lg font-semibold tracking-[0.04em] text-white transition hover:text-stone-200 lg:block xl:text-2xl"
        >
          <span>Tertulias Criollas</span>
          <span className="sr-only">Inicio</span>
        </Link>

        <Link href="#inicio" className="group justify-self-center">
          <span className="flex h-10 w-24 items-center justify-center transition min-[420px]:h-11 min-[420px]:w-28 sm:h-12 sm:w-32 lg:h-14 lg:w-36">
            <Image
              src="/logo.png"
              alt="Tertulias Criollas"
              width={180}
              height={80}
              className="h-full w-auto object-contain"
              priority
            />
          </span>
        </Link>

        <nav className="col-span-3 row-start-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-[var(--font-heading)] text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300 min-[420px]:gap-x-4 sm:col-span-1 sm:row-start-auto sm:justify-end sm:gap-4 sm:text-xs sm:tracking-[0.16em] lg:gap-5 lg:text-sm lg:tracking-[0.18em]">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition duration-300 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
