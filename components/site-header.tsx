"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Reserva", href: "#reserva" },
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
      className={`fixed left-0 top-0 z-40 w-full border-b px-5 py-4 transition-all duration-500 sm:px-8 ${
        hasScrolled
          ? "border-white/10 bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link href="#inicio" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] font-[var(--font-heading)] text-lg text-white transition group-hover:border-white/35 group-hover:bg-white/[0.08]">
            TC
          </span>
          <span className="hidden font-[var(--font-heading)] text-xl text-white sm:block">
            Tertulias Criollas
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.1em] text-stone-300 sm:gap-6 sm:text-xs sm:tracking-[0.18em]">
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
