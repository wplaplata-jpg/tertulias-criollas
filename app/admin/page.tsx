"use client";

import { useEffect, useState } from "react";

type AdminReservation = {
  id: string;
  nombreApellido: string;
  documento: string;
  email: string;
  residencia: string;
  status: "PENDING" | "CONTACTED" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
};

type AdminStats = {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  occupiedSeats: number;
  remainingSeats: number;
};

type AdminReservationsResponse = {
  reservations: AdminReservation[];
  stats: AdminStats;
};

const emptyStats: AdminStats = {
  totalReservations: 0,
  pendingReservations: 0,
  confirmedReservations: 0,
  occupiedSeats: 0,
  remainingSeats: 25
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmingId, setConfirmingId] = useState("");

  async function fetchReservations() {
    const response = await fetch("/api/admin/reservas", {
      cache: "no-store"
    });
    const data = (await response.json()) as AdminReservationsResponse;

    setReservations(data.reservations);
    setStats(data.stats);
  }

  useEffect(() => {
    fetchReservations()
      .catch(() => {
        setErrorMessage("No se pudieron cargar las reservas.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function confirmPayment(reservationId: string) {
    setConfirmingId(reservationId);
    setActionMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/admin/reservas/${reservationId}/confirmar`,
        {
          method: "POST"
        }
      );
      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "No se pudo confirmar la reserva.");
      }

      setActionMessage("Pago confirmado y voucher enviado al visitante.");
      await fetchReservations();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar la reserva."
      );
    } finally {
      setConfirmingId("");
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
            Administración
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold tracking-[0.065em] text-white sm:text-6xl">
            Reservas
          </h1>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Reservas totales", stats.totalReservations],
            ["Pendientes", stats.pendingReservations],
            ["Confirmadas", stats.confirmedReservations],
            ["Cupos ocupados", stats.occupiedSeats],
            ["Cupos restantes", stats.remainingSeats]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                {label}
              </p>
              <p className="mt-3 font-[var(--font-heading)] text-4xl text-stone-100">
                {value}
              </p>
            </div>
          ))}
        </section>

        {actionMessage ? (
          <p className="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {actionMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-8 rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </p>
        ) : null}

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-black/40 text-xs uppercase tracking-[0.18em] text-stone-500">
                <tr>
                  <th className="px-5 py-4">Nombre</th>
                  <th className="px-5 py-4">Documento</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Residencia</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Creada</th>
                  <th className="px-5 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-stone-400" colSpan={7}>
                      Cargando reservas...
                    </td>
                  </tr>
                ) : null}

                {!isLoading && reservations.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-stone-400" colSpan={7}>
                      Todavía no hay reservas.
                    </td>
                  </tr>
                ) : null}

                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="text-stone-300">
                    <td className="px-5 py-4 text-stone-100">
                      {reservation.nombreApellido}
                    </td>
                    <td className="px-5 py-4">{reservation.documento}</td>
                    <td className="px-5 py-4">{reservation.email}</td>
                    <td className="px-5 py-4">{reservation.residencia}</td>
                    <td className="px-5 py-4">{reservation.status}</td>
                    <td className="px-5 py-4">
                      {formatDate(reservation.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => confirmPayment(reservation.id)}
                        disabled={
                          confirmingId === reservation.id ||
                          reservation.status === "CANCELLED"
                        }
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {confirmingId === reservation.id
                          ? "Confirmando..."
                          : "Confirmar pago"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
