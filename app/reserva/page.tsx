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
        "Solicitud recibida. Nos contactaremos por email para continuar con la preventa."
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
          <h1 className="mt-4 font-[var(--font-heading)] text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Solicitud de reserva
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-300 sm:text-base">
            Completá tus datos para solicitar tu lugar en una velada de cupos
            reducidos.
          </p>
        </header>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)] sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Reservar lugar"}
            </button>
          </form>

          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-6 text-center sm:p-8">
            <h2 className="font-[var(--font-heading)] text-2xl text-stone-100 sm:text-3xl">
              Datos para la preventa
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">
              Una vez enviada la solicitud, nos contactaremos por correo
              electrónico para compartir las instrucciones de pago por
              transferencia y continuar con la confirmación de la reserva.
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">
              La reserva quedará sujeta a disponibilidad y a la validación del
              pago correspondiente.
            </p>
            <p className="mx-auto mt-6 max-w-lg border-t border-white/10 pt-6 text-xs leading-6 text-stone-500 sm:text-sm">
              Al tratarse de una experiencia privada de cupos reducidos, cada
              solicitud será revisada individualmente.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
