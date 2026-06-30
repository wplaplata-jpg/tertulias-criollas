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
      className={`fixed left-0 top-0 z-40 w-full border-b px-5 py-4 transition-all duration-500 sm:px-8 ${
        hasScrolled
          ? "border-white/10 bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link href="#inicio" className="group flex items-center gap-3">
          <span className="flex h-14 w-28 items-center justify-start transition sm:w-36">
            <Image
              src="/logo.png"
              alt="Tertulias Criollas"
              width={180}
              height={80}
              className="h-full w-auto object-contain"
              priority
            />
          </span>
          <span className="hidden font-[var(--font-heading)] text-2xl font-semibold tracking-[0.04em] text-white sm:block">
            Tertulias Criollas
          </span>
        </Link>

        <nav className="flex items-center gap-2 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.12em] text-stone-300 sm:gap-5 sm:text-sm sm:tracking-[0.18em]">
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
