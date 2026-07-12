import Link from "next/link";
import localFont from "next/font/local";

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
  return (
    <header
      className="fixed left-0 top-0 z-40 w-full border-b border-transparent bg-transparent px-4 py-3 transition-all duration-500 sm:px-6 sm:py-4 lg:px-8"
    >
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3">
        <Link
          href="#inicio"
          className={`${monogramFont.className} text-[2.1rem] font-normal leading-none tracking-[0.04em] text-[#e5d2a3] transition hover:text-[#f5e6bd] min-[420px]:text-[2.35rem] sm:text-[2.7rem] lg:text-[3rem] xl:text-[3.25rem]`}
        >
          <span aria-hidden="true">TC</span>
          <span className="sr-only">Inicio</span>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-2 font-[var(--font-heading)] text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300 min-[420px]:gap-x-4 sm:gap-4 sm:text-xs sm:tracking-[0.16em] lg:gap-5 lg:text-sm lg:tracking-[0.18em]">
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
