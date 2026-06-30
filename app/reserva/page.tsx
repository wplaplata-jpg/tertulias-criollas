"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";

const reservationFields = [
  { id: "nombreApellido", label: "Nombre y apellido", type: "text", placeholder: "Tu nombre completo" },
  { id: "documento", label: "DNI o pasaporte", type: "text", placeholder: "Número de documento" },
  { id: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
  { id: "email", label: "Email", type: "email", placeholder: "nombre@email.com" },
  { id: "residencia", label: "Residencia", type: "text", placeholder: "Ciudad o país" }
] as const;

const eventDetails = [
  ["Fecha", "Último sábado de cada mes"],
  ["Horario", "18:00 a 22:00 hs"],
  ["Lugar", "Casona La EnriSu"],
  ["Modalidad", "Preventa por transferencia"],
  ["Cupos", "Cupos disponibles: 25"]
] as const;

export default function ReservationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombreApellido: formData.get("nombreApellido"),
          documento: formData.get("documento"),
          fechaNacimiento: formData.get("fechaNacimiento"),
          email: formData.get("email"),
          residencia: formData.get("residencia")
        })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSuccessMessage(
        "Recibimos tu solicitud de reserva de preventa. Nos contactaremos por email para compartir las instrucciones de transferencia y continuar con la confirmación."
      );
      event.currentTarget.reset();
    } catch {
      setErrorMessage("No pudimos enviar la solicitud. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.24em] text-stone-400 transition hover:text-stone-100"
        >
          Volver a Tertulias Criollas
        </Link>

        <header className="mt-12 text-center sm:mt-16">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
            Próxima experiencia
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-[0.98] tracking-[0.065em] text-white sm:text-6xl md:text-7xl">
            Reserva de preventa
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
            Completá tus datos para solicitar tu lugar en la próxima edición de
            Tertulias Criollas. La reserva es individual y queda sujeta a
            disponibilidad.
          </p>
          <div className="mx-auto mt-6 inline-flex rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-xs uppercase tracking-[0.2em] text-stone-200">
            Cupos disponibles: 25
          </div>
          <p className="mt-4 text-xs leading-6 text-stone-500 sm:text-sm">
            Cada solicitud corresponde a una reserva individual.
          </p>
        </header>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {eventDetails.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                  {label}
                </p>
                <p className="mt-3 font-[var(--font-heading)] text-2xl font-semibold leading-7 tracking-[0.045em] text-stone-100">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 text-center sm:p-8">
            <h2 className="font-[var(--font-heading)] text-3xl font-semibold tracking-[0.055em] text-stone-100 sm:text-4xl">
              Datos para la preventa
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8">
              Una vez enviada la solicitud, recibirás por correo electrónico las
              instrucciones para realizar la transferencia y continuar con la
              confirmación de tu reserva.
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            {reservationFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="block text-sm font-medium text-stone-200">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={"placeholder" in field ? field.placeholder : undefined}
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-white/30 focus:bg-black/60"
                />
              </div>
            ))}

            {successMessage ? (
              <p className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-100">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm leading-6 text-red-100">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-4 font-[var(--font-heading)] text-base font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Reservar lugar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
