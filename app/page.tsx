import { ReserveButton } from "@/components/reserve-button";
import { HeroVideo } from "@/components/hero-video";
import { HeroLogo } from "@/components/hero-logo";
import { SiteHeader } from "@/components/site-header";
import { GardenPhotoCarousel } from "@/components/garden-photo-carousel";
import { MusicPillarCard } from "@/components/music-pillar-card";
import { ImageSequencePillarCard } from "@/components/image-sequence-pillar-card";
import { siteContent } from "@/lib/site";
import Link from "next/link";
import localFont from "next/font/local";

const heroTitleFont = localFont({
  src: "../public/fonts/Tangerine-Regular.ttf",
  display: "swap"
});

const experiencePillars = [
  {
    title: "Música en vivo",
    icon: "music",
    href: "/galeria/musica",
    description:
      "La música es interpretada por los artistas residentes de Tertulias Criollas, con repertorios cuidadosamente seleccionados para crear una escucha cercana, íntima y profundamente ligada al espíritu de la velada."
  },
  {
    title: "Arte",
    icon: "art",
    href: "/galeria/arte",
    description:
      "Las artes visuales acompañan cada encuentro a través de obras, objetos y propuestas que dialogan con la residencia, integrando cada espacio a una experiencia cultural sensible y refinada."
  },
  {
    title: "Gastronomía",
    icon: "gastronomy",
    href: "/galeria/gastronomia",
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
  }
] as const;

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

          <HeroLogo />

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

        <section className="bg-black px-4 py-10 min-[420px]:px-6 sm:py-14">
          <div className="mx-auto max-w-5xl border-t border-[#e5d2a3]/25 pt-8 text-center sm:pt-10">
            <p className="font-[var(--font-heading)] text-sm uppercase tracking-[0.24em] text-[#e5d2a3] sm:text-base sm:tracking-[0.28em]">
              Próximas veladas
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 text-sm leading-7 text-stone-300 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:text-base">
              <span>Últimos sábados de cada mes</span>
              <span className="hidden text-[#e5d2a3]/45 sm:inline">·</span>
              <span>Próxima fecha: sábado 25 de julio</span>
              <span className="hidden text-[#e5d2a3]/45 sm:inline">·</span>
              <span>Inicio: 18:00 hs</span>
              <span className="hidden text-[#e5d2a3]/45 sm:inline">·</span>
              <span>Duración aproximada: 2 horas y 30 minutos</span>
            </div>
            <Link
              href="/reserva"
              className="mt-6 inline-flex font-[var(--font-heading)] text-sm uppercase tracking-[0.2em] text-stone-300 transition hover:text-[#e5d2a3] sm:text-base"
            >
              Ver entradas
            </Link>
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
              {experiencePillars.map((pillar) =>
                pillar.icon === "music" ? (
                  <MusicPillarCard
                    key={pillar.title}
                    title={pillar.title}
                    description={pillar.description}
                    href={pillar.href}
                  />
                ) : (
                  <ImageSequencePillarCard
                    key={pillar.title}
                    title={pillar.title}
                    description={pillar.description}
                    type={pillar.icon}
                    images={
                      pillar.icon === "art"
                        ? [
                          "/galeria/arte/arte1.jpg",
                          "/galeria/arte/arte2.jpg",
                          "/galeria/arte/arte3.jpg",
                          "/galeria/arte/arte4.jpg",
                          "/galeria/arte/arte5.jpg",
                          "/galeria/arte/arte6.jpg"
                        ]
                        : [
                          "/galeria/gastronomia/placeholder-1.svg",
                          "/galeria/gastronomia/placeholder-2.svg",
                          "/galeria/gastronomia/placeholder-3.svg"
                        ]
                    }
                  />
                )
              )}
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
                Una residencia privada especialmente preparada para recibir a los
                invitados en un entorno íntimo y cuidado.
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

        <footer className="bg-stone-950 px-4 py-8 text-center min-[420px]:px-6 sm:py-10">
          <div className="mx-auto max-w-xl border-t border-[#d8c39a]/25 pt-7">
            <p className="font-[var(--font-heading)] text-2xl text-stone-100">
              Tertulias Criollas
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">
              Música · Arte · Gastronomía
            </p>
            <p className="mt-4 text-sm text-stone-500">
              www.tertuliascriollas.com
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
