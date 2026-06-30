import { ReserveButton } from "@/components/reserve-button";
import { HeroVideo } from "@/components/hero-video";
import { SiteHeader } from "@/components/site-header";
import { siteContent } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const experiencePillars = [
  {
    title: "Música en vivo",
    description:
      "Interpretaciones en vivo de música de cámara por artistas de trayectoria internacional en un entorno íntimo.",
    image: "/galeria/musica/placeholder-1.svg",
    href: "/galeria/musica"
  },
  {
    title: "Arte",
    description:
      "Exposición de obras originales en un recorrido guiado por los espacios de la residencia.",
    image: "/galeria/arte/placeholder-1.svg",
    href: "/galeria/arte"
  },
  {
    title: "Gastronomía",
    description:
      "Experiencia culinaria de seis pasos con sabores tradicionales argentinos, acompañada por vinos seleccionados.",
    image: "/galeria/gastronomia/placeholder-1.svg",
    href: "/galeria/gastronomia"
  }
] as const;

const socialLinks = {
  instagram: "https://www.instagram.com/tertulias_criollas_hemmingsen?igsh=MW0wY2Zqd3Bic2J2YQ==",
  youtube: "https://www.youtube.com/@hemmingsenart11",
  whatsapp: "PEGAR_URL_WHATSAPP",
  email: "tertuliascriollas@gmail.com"
};

const contactLinks = [
  {
    label: "Instagram",
    icon: "IG",
    description: "Novedades, registros visuales y próximas fechas.",
    buttonLabel: "Ver Instagram",
    href: socialLinks.instagram,
    external: true
  },
  {
    label: "YouTube",
    icon: "YT",
    description: "Conocé más sobre nuestros artistas y experiencias.",
    buttonLabel: "Ver canal",
    href: socialLinks.youtube,
    external: true
  },
  {
    label: "WhatsApp",
    icon: "WA",
    description: "Consultas directas sobre cupos y disponibilidad.",
    buttonLabel: "Consultar",
    href: socialLinks.whatsapp,
    external: true
  },
  {
    label: "Email",
    icon: "@",
    description: "Contacto institucional y solicitudes especiales.",
    buttonLabel: "Escribir email",
    href: socialLinks.email,
    external: false
  }
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section id="inicio" className="relative h-screen overflow-hidden">
          <HeroVideo />

          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
            <div className="hero-content-reveal max-w-3xl">
              <h1 className="font-[var(--font-hero)] text-6xl font-medium italic leading-[0.86] tracking-[0.095em] text-[#f8f1e7] [text-shadow:0_3px_18px_rgba(0,0,0,0.42)] sm:text-7xl md:text-8xl">
                {siteContent.title}
              </h1>
              <p className="mt-5 text-base leading-8 tracking-[0.02em] text-stone-200 sm:text-lg md:text-xl">
                Una experiencia artística exclusiva
              </p>
              <div className="mt-10 flex justify-center">
                <ReserveButton label="Reservar Experiencia" />
              </div>
            </div>
          </div>
        </section>

        <section id="experiencia" className="reveal-on-scroll bg-stone-950 px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-[var(--font-heading)] text-4xl font-semibold leading-[0.98] tracking-[0.065em] text-stone-100 sm:text-5xl md:text-6xl">
                Una velada única
              </h2>
              <p className="mt-8 text-base leading-8 text-stone-300 sm:text-lg sm:leading-9">
                Una experiencia exclusiva a puertas cerradas donde el arte, la
                música y la gastronomía se combinan en un entorno íntimo y
                elegante.
              </p>
              <p className="mt-6 text-base leading-8 text-stone-400 sm:text-lg sm:leading-9">
                Inspiradas en las antiguas tertulias criollas de Buenos Aires,
                estas veladas reúnen a artistas y público en una residencia
                privada, ofreciendo un recorrido sensorial a través de la música
                de cámara, las artes visuales y una degustación gastronómica de
                seis pasos acompañada por vinos seleccionados.
              </p>
            </div>
          </div>
        </section>

        <section className="reveal-on-scroll bg-black px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {experiencePillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="group overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] transition duration-300 hover:scale-[1.01] hover:bg-white/[0.05]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={pillar.image}
                      alt={`Galería de ${pillar.title}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 transition duration-300 group-hover:bg-black/15" />
                  </div>
                  <div className="px-6 py-8 text-center">
                    <h3 className="font-[var(--font-heading)] text-3xl font-semibold tracking-[0.055em] text-stone-100">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
                      {pillar.description}
                    </p>
                    <Link
                      href={pillar.href}
                      className="mt-7 inline-flex rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12]"
                    >
                      Explorar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-on-scroll bg-stone-950 px-6 py-28 sm:py-36">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Residencia privada
              </p>
              <h2 className="mt-4 font-[var(--font-heading)] text-4xl font-semibold leading-[0.98] tracking-[0.065em] text-stone-100 sm:text-5xl md:text-6xl">
                Ubicación
              </h2>
              <p className="mt-6 text-base leading-8 text-stone-300 sm:text-lg sm:leading-9">
                La experiencia se realiza en una residencia privada cercana a
                Buenos Aires. La dirección exacta se comparte únicamente con las
                reservas confirmadas.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_42%,rgba(0,0,0,0.45))] p-4 shadow-[0_0_60px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8148.106109714309!2d-58.1013131!3d-34.9701533!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2dd0005264697%3A0x965e8b10f2aeb762!2sCasona%20La%20EnriSu!5e1!3m2!1sen!2sar!4v1782430196626!5m2!1sen!2sar"
                  title="Mapa de ubicación de Tertulias Criollas"
                  className="h-[280px] w-full border-0 sm:h-[380px]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <div className="mt-5 flex justify-center">
                <a
                  href="https://maps.app.goo.gl/VRrt6xUJv3DpyseP6"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.2em] text-stone-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12]"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="reveal-on-scroll bg-black px-6 py-28 text-center sm:py-36">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Redes y contacto
            </p>
            <h2 className="mt-4 font-[var(--font-heading)] text-4xl font-semibold leading-[0.98] tracking-[0.065em] text-stone-100 sm:text-5xl md:text-6xl">
              Contacto directo
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="group min-h-40 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-7 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08] hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs text-stone-300">
                    {link.icon}
                  </span>
                  <span className="mt-5 block text-sm font-medium uppercase tracking-[0.18em] text-stone-100">
                    {link.label}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-stone-400">
                    {link.description}
                  </span>
                  <span className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.18em] text-stone-200 transition group-hover:border-white/30">
                    {link.buttonLabel}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-stone-950 px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-[var(--font-heading)] text-2xl text-stone-100">
                Tertulias Criollas
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Experiencias culturales exclusivas
              </p>
            </div>

            <div className="flex gap-3">
              {contactLinks.map((link) => (
                <span
                  key={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs text-stone-400"
                >
                  {link.icon}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
