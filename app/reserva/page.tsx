"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";

const MAX_CAPACITY = 25;

const reservationFields = [
  {
    id: "nombreApellido",
    label: "Nombre y apellido",
    type: "text",
    placeholder: "Tu nombre completo"
  },
  {
    id: "documento",
    label: "DNI o pasaporte",
    type: "text",
    placeholder: "Número de documento"
  },
  {
    id: "fechaNacimiento",
    label: "Fecha de nacimiento",
    type: "date"
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "nombre@email.com"
  },
  {
    id: "residencia",
    label: "Residencia",
    type: "text",
    placeholder: "Ciudad o país"
  },
  {
    id: "telefono",
    label: "Teléfono",
    type: "tel",
    placeholder: "Teléfono"
  }
] as const;

type ReservationResponse = {
  success?: boolean;
  reservationId?: string;
  message?: string;
  error?: string;
  remainingSeats?: number;
};

type SeatAvailability = {
  maxCapacity: number;
  reservedSeats: number;
  remainingSeats: number;
};

type ReservationPayload = {
  nombreApellido: FormDataEntryValue | null;
  documento: FormDataEntryValue | null;
  fechaNacimiento: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  residencia: FormDataEntryValue | null;
  telefono?: string;
};

const fallbackErrorMessage =
  "No pudimos enviar la solicitud. Intentá nuevamente.";
const soldOutMessage = "Los cupos para esta edición se encuentran completos.";

export default function ReservationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [seatAvailability, setSeatAvailability] =
    useState<SeatAvailability | null>(null);

  const remainingSeats = seatAvailability?.remainingSeats ?? null;
  const maxCapacity = seatAvailability?.maxCapacity ?? MAX_CAPACITY;
  const isSoldOut = remainingSeats === 0;

  useEffect(() => {
    async function fetchSeatAvailability() {
      try {
        const response = await fetch("/api/reserva/cupos", {
          cache: "no-store"
        });
        const data = (await response.json()) as SeatAvailability;

        setSeatAvailability(data);
      } catch {
        setSeatAvailability(null);
      }
    }

    fetchSeatAvailability();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (isSoldOut) {
      setErrorMessage(soldOutMessage);
      setIsSubmitting(false);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const telefono = formData.get("telefono");
    const payload: ReservationPayload = {
      nombreApellido: formData.get("nombreApellido"),
      documento: formData.get("documento"),
      fechaNacimiento: formData.get("fechaNacimiento"),
      email: formData.get("email"),
      residencia: formData.get("residencia")
    };

    if (typeof telefono === "string" && telefono.trim()) {
      payload.telefono = telefono.trim();
    }

    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as ReservationResponse;

      if (data.success === true) {
        setErrorMessage("");
        setSuccessMessage(
          "Solicitud recibida. Nos contactaremos por email para continuar con la confirmación del pago."
        );

        if (typeof data.remainingSeats === "number") {
          const updatedRemainingSeats = data.remainingSeats;

          setSeatAvailability((currentAvailability) => ({
            maxCapacity: currentAvailability?.maxCapacity ?? MAX_CAPACITY,
            reservedSeats:
              (currentAvailability?.maxCapacity ?? MAX_CAPACITY) -
              updatedRemainingSeats,
            remainingSeats: updatedRemainingSeats
          }));
        }

        form.reset();
        return;
      }

      setSuccessMessage("");
      setErrorMessage(data.error || data.message || fallbackErrorMessage);
    } catch {
      setSuccessMessage("");
      setErrorMessage(fallbackErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-100 min-[420px]:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.2em] text-stone-400 transition hover:text-stone-100 sm:text-xs sm:tracking-[0.24em]"
        >
          Volver a Tertulias Criollas
        </Link>

        <header className="mt-10 text-center sm:mt-14 lg:mt-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.35em]">
            Próxima experiencia
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-4xl font-semibold leading-[1] tracking-[0.06em] text-white min-[420px]:text-5xl sm:text-6xl md:text-7xl">
            Entradas
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-300 sm:mt-6 sm:text-base sm:leading-8">
            Completá tus datos para solicitar tu lugar. La reserva queda sujeta
            a disponibilidad y se confirma una vez acreditado el pago.
          </p>
          <div className="mx-auto mt-5 inline-flex rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-stone-200 sm:mt-6 sm:px-5 sm:text-xs sm:tracking-[0.2em]">
            {remainingSeats === null ? (
              "Consultando cupos..."
            ) : (
              <>
                <span>Cupos disponibles:</span>
                <span className="mx-1">{remainingSeats}</span>
                <span>de</span>
                <span className="ml-1">{maxCapacity}</span>
              </>
            )}
          </div>
          {isSoldOut ? (
            <p className="mt-4 text-xs leading-6 text-red-200 sm:text-sm">
              {soldOutMessage}
            </p>
          ) : (
            <p className="mt-4 text-xs leading-6 text-stone-500 sm:text-sm">
              Cada solicitud corresponde a una reserva individual.
            </p>
          )}
        </header>

        <section className="mt-10 space-y-5 sm:mt-12 sm:space-y-6">
          <div className="rounded-[1.5rem] border border-[#e5d2a3]/20 bg-white/[0.025] p-5 text-center shadow-[0_0_40px_rgba(0,0,0,0.22)] min-[420px]:p-6 sm:rounded-[2rem] sm:p-7">
            <p className="font-[var(--font-heading)] text-2xl font-semibold tracking-[0.06em] text-stone-100 sm:text-3xl">
              Próxima velada
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-300 sm:text-base">
              Sábado 26 de julio · 18:00 hs
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500 sm:text-sm">
              Duración aproximada: 2 h 30 min
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_50px_rgba(0,0,0,0.28)] min-[420px]:p-6 sm:rounded-[2rem] sm:p-8">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold tracking-[0.055em] text-stone-100 sm:text-3xl">
              Participación
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300 sm:text-base">
              <li>Experiencia completa: USD 270 por persona.</li>
              <li>Residentes en Argentina: 30 % de descuento.</li>
              <li>Transporte opcional: USD 38 por persona.</li>
              <li>
                Para confirmar la reserva se solicita el pago del 40 % del
                valor total.
              </li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_50px_rgba(0,0,0,0.28)] min-[420px]:p-6 sm:rounded-[2rem] sm:p-8">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold tracking-[0.055em] text-stone-100 sm:text-3xl">
              Información importante
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-300 sm:text-base">
              Se recomienda asistir con una vestimenta acorde al carácter de la
              velada.
            </p>
          </div>

          <form
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(0,0,0,0.35)] min-[420px]:p-6 sm:rounded-[2rem] sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-5 sm:space-y-6">
            {reservationFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.id}
                    className="block text-sm font-medium tracking-[0.02em] text-stone-200"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={
                    "placeholder" in field ? field.placeholder : undefined
                  }
                  disabled={isSubmitting || isSoldOut}
                  className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/45 px-4 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-white/35 focus:bg-black/65 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            ))}
            </div>

            {successMessage ? (
              <p className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-4 text-center text-sm leading-6 text-emerald-100 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="mt-6 rounded-2xl border border-red-300/25 bg-red-300/10 px-4 py-4 text-center text-sm leading-6 text-red-100 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || isSoldOut}
              className="mt-7 w-full rounded-full border border-white/30 bg-stone-100 px-5 py-4 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.18em] text-stone-950 shadow-[0_18px_45px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:border-white hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:text-base sm:tracking-[0.24em]"
            >
              {isSubmitting ? "Enviando..." : "Reservar lugar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
