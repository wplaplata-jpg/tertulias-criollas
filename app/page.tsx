import { ReserveButton } from "@/components/reserve-button";
import { HeroVideo } from "@/components/hero-video";
import { SiteHeader } from "@/components/site-header";
import { siteContent } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

const heroTitleFont = localFont({
  src: "../public/fonts/Tangerine-Regular.ttf",
  display: "swap"
});

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

const WHATSAPP_URL = "https://wa.me/5492210000000";

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

function EditorialImage({
  src,
  alt,
  label
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="reveal-on-scroll bg-stone-950 px-4 pb-16 min-[420px]:px-6 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="relative h-[220px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_35%_25%,rgba(245,222,179,0.18),transparent_34%),linear-gradient(135deg,rgba(68,50,35,0.9),rgba(6,6,6,1))] shadow-[0_30px_90px_rgba(0,0,0,0.38)] min-[420px]:h-[280px] sm:h-[420px] sm:rounded-[2rem] lg:h-[520px]">
          <div
            role="img"
            aria-label={alt}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.42))]" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-center backdrop-blur-md sm:inset-x-auto sm:left-8 sm:max-w-sm sm:px-5 sm:py-4 sm:text-left">
            <p className="font-[var(--font-heading)] text-xl font-semibold tracking-[0.05em] text-stone-100 sm:text-2xl">
              {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Imagen preparada para reemplazar por fotografía real.
            </p>
          </div>
        </div>
      </div>
    </div>
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
                <ReserveButton label="Reservar Experiencia" />
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

        <EditorialImage
          src="/images/evento.jpg"
          alt="Fotografía de una velada de Tertulias Criollas"
          label="La intimidad del encuentro"
        />

        <section className="reveal-on-scroll bg-black px-4 py-20 min-[420px]:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 sm:gap-8 md:grid-cols-3">
              {experiencePillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03] transition duration-300 hover:scale-[1.01] hover:bg-white/[0.05] sm:rounded-[2rem]"
                >
                  <div className="relative h-56 overflow-hidden min-[420px]:h-64 md:h-60 lg:h-64">
                    <Image
                      src={pillar.image}
                      alt={`Galería de ${pillar.title}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 transition duration-300 group-hover:bg-black/15" />
                  </div>
                  <div className="px-5 py-7 text-center sm:px-6 sm:py-8">
                    <h3 className="font-[var(--font-heading)] text-2xl font-semibold tracking-[0.055em] text-stone-100 sm:text-3xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
                      {pillar.description}
                    </p>
                    <Link
                      href={pillar.href}
                      className="mt-6 inline-flex rounded-full border border-white/20 bg-white/[0.05] px-5 py-2.5 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.2em] text-stone-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12] sm:mt-7 sm:px-6 sm:py-3 sm:text-sm sm:tracking-[0.22em]"
                    >
                      Explorar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <EditorialImage
          src="/images/jardin.jpg"
          alt="Jardín y espacio exterior de la residencia"
          label="El jardín de la residencia"
        />

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
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Redes y contacto
            </p>
            <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold leading-[1] tracking-[0.065em] text-stone-100 min-[420px]:text-4xl sm:text-5xl md:text-6xl">
              Contacto directo
            </h2>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="group min-h-36 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08] hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:min-h-40 sm:px-6 sm:py-7"
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
