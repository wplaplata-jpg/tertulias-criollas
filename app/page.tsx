import { ReserveButton } from "@/components/reserve-button";
import { HeroVideo } from "@/components/hero-video";
import { SiteHeader } from "@/components/site-header";
import { GardenPhotoCarousel } from "@/components/garden-photo-carousel";
import { siteContent } from "@/lib/site";
import localFont from "next/font/local";

const heroTitleFont = localFont({
  src: "../public/fonts/Tangerine-Regular.ttf",
  display: "swap"
});

const experiencePillars = [
  {
    title: "Música en vivo",
    icon: "music",
    description:
      "Cada encuentro reúne intérpretes de trayectoria, repertorios cuidadosamente seleccionados y una escucha cercana. La música forma parte esencial de la velada, creando un diálogo íntimo entre artistas, anfitriones y público."
  },
  {
    title: "Arte",
    icon: "art",
    description:
      "En cada edición se presentan artistas invitados, obras y propuestas que dialogan con el entorno de la residencia. La experiencia visual acompaña el recorrido y construye una atmósfera cultural integrada."
  },
  {
    title: "Gastronomía",
    icon: "gastronomy",
    description:
      "La propuesta gastronómica está pensada para acompañar la experiencia completa, con productos seleccionados, sabores regionales y un servicio acorde al carácter íntimo y exclusivo del encuentro."
  }
] as const;

const WHATSAPP_URL = "https://wa.me/5492215010965";

const socialLinks = {
  instagram: "https://www.instagram.com/tertulias_criollas_hemmingsen?igsh=MW0wY2Zqd3Bic2J2YQ==",
  youtube: "https://www.youtube.com/@hemmingsenart11",
  whatsapp: WHATSAPP_URL,
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

function PillarIcon({
  type
}: {
  type: (typeof experiencePillars)[number]["icon"];
}) {
  const iconClass = "h-12 w-12 text-[#e5d2a3] sm:h-16 sm:w-16";

  function Medallion({ children }: { children: React.ReactNode }) {
    return (
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e5d2a3]/30 bg-[radial-gradient(circle_at_center,rgba(229,210,163,0.12),rgba(255,255,255,0.02)_58%,transparent)] shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:h-24 sm:w-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e5d2a3]/10 sm:h-20 sm:w-20">
          {children}
        </div>
      </div>
    );
  }

  if (type === "music") {
    return (
      <Medallion>
        <svg
          viewBox="0 0 72 72"
          aria-hidden="true"
          className={iconClass}
          fill="none"
        >
          <path
            d="M39.5 10.5v39.8c0 6.2-5.1 11.2-11.3 11.2s-11.3-5-11.3-11.2 5.1-11.2 11.3-11.2c4.3 0 8.1 2.4 10 5.9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
          <path
            d="M39.5 10.5c8.4 1.7 13.6 5.6 13.6 11.2 0 4.6-3.5 8.3-9.2 10.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
          <path
            d="M23 22.4h27.5M22 29.2h24M22 36h18.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.85"
            opacity="0.52"
          />
          <path
            d="M19 12c-2.7 2-4.3 4.6-4.3 7.5M55.8 52.2c2.4-2.1 3.8-4.6 3.8-7.3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.85"
            opacity="0.4"
          />
        </svg>
      </Medallion>
    );
  }

  if (type === "art") {
    return (
      <Medallion>
        <svg
          viewBox="0 0 72 72"
          aria-hidden="true"
          className={iconClass}
          fill="none"
        >
          <path
            d="M18 48.5c4.2 4 11.1 6.7 18.8 6.7 13.2 0 23.8-8.6 23.8-19.3S50 16.5 36.8 16.5 13 25.2 13 36c0 3.5 1.9 5.7 5.1 5.7h4.6c3.2 0 5 3.8 3.1 6.3l-1.1 1.4c-1.4 1.8-4.1 1.9-6.7-.9Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.15"
          />
          <path
            d="M28 29h.1M37 25.5h.1M46 29h.1M49.8 39.2h.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M33.5 43.8 52 25.4M47.8 23.8l5.8 5.8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.1"
          />
          <path
            d="M18.4 21.5c2.5-4.4 7.4-7.7 13.3-9M55.2 51.4c-3 3.3-7.4 5.8-12.6 7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.85"
            opacity="0.4"
          />
        </svg>
      </Medallion>
    );
  }

  return (
    <Medallion>
      <svg
        viewBox="0 0 72 72"
        aria-hidden="true"
        className={iconClass}
        fill="none"
      >
        <path
          d="M24 14h24v10.5c0 6.6-5.4 12-12 12s-12-5.4-12-12V14Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.15"
        />
        <path
          d="M36 36.5V57M27.5 57h17M25.8 23h20.4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.15"
        />
        <path
          d="M54 15v42M59 15v42M54 28h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          opacity="0.78"
        />
        <path
          d="M17 15v42M13.5 15c0 8.5 7 8.5 7 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          opacity="0.78"
        />
        <path
          d="M21.2 11.8c-3.3 1.9-5.7 4.9-6.7 8.5M51.5 60.4c3.4-1.9 5.8-5 6.8-8.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="0.85"
          opacity="0.4"
        />
      </svg>
    </Medallion>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section
          id="inicio"
          className="relative h-[100svh] min-h-[600px] overflow-hidden min-[420px]:min-h-[620px] sm:h-screen sm:min-h-[660px] md:min-h-[720px] xl:min-h-[780px]"
        >
          <HeroVideo />

          <div className="absolute inset-0 bg-black/58 sm:bg-black/65 xl:bg-black/60" />

          <div className="relative z-10 flex h-full items-center justify-center px-4 pb-32 pt-36 text-center min-[420px]:px-6 sm:pb-32 sm:pt-28 md:pb-28 lg:pb-24">
            <div className="hero-content-reveal mx-auto w-full max-w-[22rem] min-[420px]:max-w-2xl md:max-w-3xl xl:max-w-4xl">
              <h1 className={`${heroTitleFont.className} text-[clamp(3.8rem,17vw,5.6rem)] font-normal leading-[0.8] tracking-[0.02em] text-[#f8f1e7] [text-shadow:0_3px_18px_rgba(0,0,0,0.42)] sm:text-[clamp(5.8rem,10vw,8rem)] md:text-[8.8rem] xl:text-[10rem] 2xl:text-[11rem]`}>
                {siteContent.title}
              </h1>
              <p className="mx-auto mt-4 max-w-[18rem] text-sm leading-7 tracking-[0.02em] text-stone-200 min-[420px]:max-w-none min-[420px]:text-base sm:mt-5 sm:text-lg md:text-xl md:leading-8">
                Una experiencia artística exclusiva
              </p>
              <div className="mt-7 flex justify-center sm:mt-10">
                <ReserveButton label="Entradas" />
              </div>
            </div>
          </div>
        </section>

        <section id="experiencia" className="reveal-on-scroll bg-stone-950 px-4 py-20 min-[420px]:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className={`${heroTitleFont.className} text-5xl font-normal leading-[0.88] tracking-[0.02em] text-stone-100 min-[420px]:text-6xl sm:text-7xl md:text-8xl`}>
                Una velada única
              </h2>
              <p className="mt-6 text-[15px] leading-8 text-stone-300 sm:mt-8 sm:text-lg sm:leading-9">
                Una experiencia exclusiva a puertas cerradas donde el arte, la
                música y la gastronomía se combinan en un entorno íntimo y
                elegante.
              </p>
              <p className="mt-5 text-[15px] leading-8 text-stone-400 sm:mt-6 sm:text-lg sm:leading-9">
                Inspiradas en las antiguas tertulias criollas de Buenos Aires,
                estas veladas reúnen a artistas y público en una residencia
                privada, ofreciendo un recorrido sensorial a través de la música
                de cámara, las artes visuales y una degustación gastronómica de
                seis pasos acompañada por vinos seleccionados.
              </p>
            </div>
          </div>
        </section>

        <GardenPhotoCarousel
          label="Fotografía decorativa de la experiencia"
          initialIndex={0}
        />

        <section className="reveal-on-scroll bg-black px-4 py-16 min-[420px]:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
              {experiencePillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="group flex flex-col justify-between rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-7 text-center transition duration-300 hover:scale-[1.01] hover:bg-white/[0.05] sm:min-h-[22rem] sm:rounded-[2rem] sm:px-6 sm:py-10"
                >
                  <div>
                    <div className="mb-5 flex justify-center sm:mb-8">
                      <PillarIcon type={pillar.icon} />
                    </div>
                    <h3 className="font-[var(--font-heading)] text-[1.7rem] font-semibold leading-[1] tracking-[0.055em] text-stone-100 sm:text-3xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-7 text-stone-300 sm:text-base sm:leading-8">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-on-scroll bg-stone-950 px-4 py-20 min-[420px]:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Residencia privada
              </p>
              <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold leading-[1] tracking-[0.065em] text-stone-100 min-[420px]:text-4xl sm:text-5xl md:text-6xl">
                Ubicación
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-stone-300 sm:mt-6 sm:text-lg sm:leading-9">
                La experiencia se realiza en una residencia privada cercana a
                Buenos Aires. La dirección exacta se comparte únicamente con las
                reservas confirmadas.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_42%,rgba(0,0,0,0.45))] p-3 shadow-[0_0_60px_rgba(0,0,0,0.35)] sm:rounded-[2rem] sm:p-6">
              <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/35 sm:rounded-[1.5rem]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8148.106109714309!2d-58.1013131!3d-34.9701533!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2dd0005264697%3A0x965e8b10f2aeb762!2sCasona%20La%20EnriSu!5e1!3m2!1sen!2sar!4v1782430196626!5m2!1sen!2sar"
                  title="Mapa de ubicación de Tertulias Criollas"
                  className="h-[240px] w-full border-0 min-[420px]:h-[280px] sm:h-[380px]"
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
                  className="rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-stone-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12] sm:px-6 sm:py-3 sm:text-sm sm:tracking-[0.2em]"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="reveal-on-scroll bg-black px-4 py-20 text-center min-[420px]:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-[var(--font-heading)] text-3xl font-semibold leading-[1] tracking-[0.08em] text-stone-100 min-[420px]:text-4xl sm:text-5xl md:text-6xl">
              Contacto
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-[#d8c39a]/35" />
            <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-8 text-stone-300 sm:text-lg sm:leading-9">
              Para consultas sobre próximas fechas, disponibilidad o solicitudes especiales, podés comunicarte directamente con nosotros.
            </p>

            <nav
              aria-label="Redes y contacto"
              className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-4 text-center sm:mt-12 sm:gap-x-6"
            >
              {contactLinks.map((link, index) => (
                <span
                  key={link.label}
                  className="inline-flex items-center gap-x-4 sm:gap-x-6"
                >
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="group inline-flex items-center gap-2 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.22em] text-stone-300 transition duration-300 hover:text-[#ead8ad] sm:text-base"
                  >
                    <span className="text-xs text-[#d8c39a]/80 transition duration-300 group-hover:text-[#ead8ad]">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </a>
                  {index < contactLinks.length - 1 ? (
                    <span aria-hidden="true" className="text-[#d8c39a]/35">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </nav>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-stone-950 px-4 py-8 min-[420px]:px-6 sm:py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-[var(--font-heading)] text-2xl text-stone-100">
                Tertulias Criollas
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Experiencias culturales exclusivas
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-stone-500 sm:justify-end">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="transition duration-300 hover:text-[#ead8ad]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
