import Link from "next/link";

const artists = [
  {
    name: "Guillermo Hemmingsen",
    role: "Tenor · Director Orquestal",
    description:
      "Graduado con honores en Música de Cámara y Dirección Orquestal por la Universidad Nacional de La Plata. Formado por destacados maestros nacionales e internacionales, desarrolló una sólida trayectoria artística y docente, con participación en seminarios y masterclasses en instituciones como el Teatro Colón."
  },
  {
    name: "Adriana Hemmingsen",
    role: "Artista Plástica",
    description:
      "Licenciada en Artes Plásticas con especialización en Pintura y Escultura por la Universidad Nacional de La Plata. Su trayectoria incluye premios, exposiciones y una reconocida labor artística, destacándose por su trabajo escultórico y pictórico."
  },
  {
    name: "May Hemmingsen",
    role: "Soprano",
    description:
      "Formada en el Conservatorio Nacional Carlos López Buchardo y en el Instituto Superior de Arte del Teatro Colón. Ha desarrollado una extensa carrera como solista en importantes escenarios nacionales e internacionales."
  }
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.24em] text-stone-400 transition hover:text-stone-100"
        >
          Volver a Tertulias Criollas
        </Link>

        <header className="mx-auto mt-14 max-w-4xl text-center sm:mt-20">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
            Artistas anfitriones
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-[0.98] tracking-[0.065em] text-white sm:text-6xl md:text-7xl">
            Quiénes somos
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-stone-300 sm:text-lg sm:leading-9">
            Los Hemmingsen son una familia de artistas argentinos que abren las
            puertas de su casa para compartir una experiencia íntima donde la
            música, las artes visuales y la gastronomía se encuentran en una
            velada única.
          </p>
        </header>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {artists.map((artist) => (
            <article
              key={artist.name}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] sm:p-8"
            >
              <p className="font-[var(--font-heading)] text-3xl font-semibold leading-[0.98] tracking-[0.055em] text-stone-100 sm:text-4xl">
                {artist.name}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-stone-500">
                {artist.role}
              </p>
              <p className="mt-6 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8">
                {artist.description}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-14 flex justify-center">
          <Link
            href="/reserva"
            className="rounded-full border border-white/25 bg-white/[0.08] px-7 py-3 font-[var(--font-heading)] text-base font-semibold uppercase tracking-[0.24em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.14] hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
          >
            Reservar mi lugar
          </Link>
        </div>
      </div>
    </main>
  );
}
