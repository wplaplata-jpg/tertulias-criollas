"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useState } from "react";

const monogramFont = localFont({
  src: "../public/fonts/Tangerine-Regular.ttf",
  display: "swap"
});

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Entradas", href: "/reserva" },
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
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6 lg:flex-nowrap lg:justify-between">
        <div className="flex shrink-0 items-center gap-x-3 sm:gap-x-5 lg:gap-x-8">
          <Link
            href="#inicio"
            className={`${monogramFont.className} text-[2.1rem] font-normal leading-none tracking-[0.04em] text-[#e5d2a3] transition hover:text-[#f5e6bd] min-[420px]:text-[2.35rem] sm:text-[2.7rem] lg:text-[3rem] xl:text-[3.25rem]`}
          >
            <span aria-hidden="true">TC</span>
            <span className="sr-only">Inicio</span>
          </Link>

          <Link href="#inicio" className="group">
            <span className="flex h-9 w-20 items-center justify-center transition min-[420px]:h-10 min-[420px]:w-24 sm:h-12 sm:w-32 lg:h-14 lg:w-36">
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
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-[var(--font-heading)] text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300 min-[420px]:gap-x-4 sm:gap-4 sm:text-xs sm:tracking-[0.16em] lg:justify-end lg:gap-5 lg:text-sm lg:tracking-[0.18em]">
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
