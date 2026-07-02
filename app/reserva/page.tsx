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
  { id: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
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
  }
] as const;

const encounterConsiderations = [
  "Al tratarse de una residencia privada que abre sus puertas de manera excepcional, se invita a los asistentes a concurrir con vestimenta elegante, en armonía con el carácter de la velada.",
  "Las Tertulias Criollas se realizan en fechas especialmente seleccionadas y cuentan con capacidad reducida para preservar la intimidad del encuentro.",
  "La dirección exacta y las indicaciones finales de acceso se compartirán únicamente con las reservas confirmadas.",
  "La reserva es individual y queda sujeta a disponibilidad.",
  "La preventa se completa mediante transferencia, según las instrucciones enviadas por correo electrónico."
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
  const seatsLabel =
    remainingSeats === null
      ? "Consultando cupos..."
      : `Cupos disponibles: ${remainingSeats} de ${maxCapacity}`;

  const eventDetails = [
    ["Fecha", "Último sábado de cada mes"],
    ["Horario", "18:00 a 22:00 hs"],
    ["Lugar", "Casona La EnriSu"],
    ["Modalidad", "Preventa por transferencia"],
    ["Cupos", seatsLabel]
  ] as const;

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

      const data = (await response.json()) as ReservationResponse;

      if (data.success === true) {
        setErrorMessage("");
        setSuccessMessage(
          "Solicitud recibida. Nos contactaremos por email para continuar con la preventa."
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
            {seatsLabel}
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

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 sm:p-8">
            <h2 className="text-center font-[var(--font-heading)] text-3xl font-semibold tracking-[0.055em] text-stone-100 sm:text-4xl">
              Consideraciones para el encuentro
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              {encounterConsiderations.map((consideration) => (
                <li key={consideration} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-500" />
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            {reservationFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-stone-200"
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
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-white/30 focus:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={isSubmitting || isSoldOut}
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
