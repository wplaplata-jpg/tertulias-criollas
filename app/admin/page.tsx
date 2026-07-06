"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

type ReservationStatus = "PENDING" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

type AdminReservation = {
  id: string;
  publicCode: string | null;
  nombreApellido: string;
  documento: string;
  fechaNacimiento: string;
  email: string;
  telefono: string | null;
  residencia: string;
  status: ReservationStatus;
  createdAt: string;
};

type AdminStats = {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  occupiedSeats: number;
  remainingSeats: number;
};

type AdminReservationsResponse = {
  reservations: AdminReservation[];
  stats: AdminStats;
};

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

const emptyStats: AdminStats = {
  totalReservations: 0,
  pendingReservations: 0,
  confirmedReservations: 0,
  cancelledReservations: 0,
  occupiedSeats: 0,
  remainingSeats: 25
};

const filters: Array<{ label: string; value: FilterStatus }> = [
  { label: "Todas", value: "ALL" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Confirmadas", value: "CONFIRMED" },
  { label: "Canceladas", value: "CANCELLED" }
];

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONTACTED: "Contactada",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatBirthDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function escapeCsvValue(value: string | number | null | undefined) {
  const normalizedValue = String(value ?? "");

  return `"${normalizedValue.replaceAll('"', '""')}"`;
}

function buildCsv(reservations: AdminReservation[]) {
  const headers = [
    "Estado",
    "Nombre",
    "Documento",
    "Email",
    "Telefono",
    "Residencia",
    "Fecha nacimiento",
    "Fecha reserva",
    "Código de reserva"
  ];

  const rows = reservations.map((reservation) => [
    statusLabels[reservation.status],
    reservation.nombreApellido,
    reservation.documento,
    reservation.email,
    reservation.telefono ?? "",
    reservation.residencia,
    formatBirthDate(reservation.fechaNacimiento),
    formatDate(reservation.createdAt),
    reservation.publicCode ?? "Sin asignar"
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeAction, setActiveAction] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [selectedReservation, setSelectedReservation] =
    useState<AdminReservation | null>(null);

  const filteredReservations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const matchesStatus =
        filter === "ALL" ? true : reservation.status === filter;
      const matchesSearch =
        !normalizedQuery ||
        reservation.nombreApellido.toLowerCase().includes(normalizedQuery) ||
        reservation.email.toLowerCase().includes(normalizedQuery) ||
        reservation.documento.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [filter, query, reservations]);

  async function fetchReservations() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/reservas", {
        cache: "no-store"
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const data = (await response.json()) as AdminReservationsResponse;

      setReservations(data.reservations);
      setStats(data.stats);
    } catch {
      setErrorMessage("No se pudieron cargar las reservas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store"
        });
        const data = (await response.json()) as { authenticated?: boolean };

        setIsAuthenticated(data.authenticated === true);

        if (data.authenticated === true) {
          await fetchReservations();
        }
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setLoginError("La contraseña ingresada no es correcta.");
      return;
    }

    setPassword("");
    setIsAuthenticated(true);
    await fetchReservations();
  }

  async function handleLogout() {
    await fetch("/api/admin/session", {
      method: "DELETE"
    });
    setIsAuthenticated(false);
    setReservations([]);
    setSelectedReservation(null);
  }

  async function runReservationAction(
    reservationId: string,
    action: "confirm" | "cancel" | "pending" | "resend"
  ) {
    setActiveAction(`${reservationId}-${action}`);
    setActionMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/reservas/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
      });
      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "No se pudo actualizar la reserva.");
      }

      const messages = {
        confirm: "Reserva confirmada.",
        cancel: "Reserva cancelada.",
        pending: "Reserva marcada como pendiente.",
        resend: "Email reenviado correctamente."
      };

      setActionMessage(messages[action]);
      await fetchReservations();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la reserva."
      );
    } finally {
      setActiveAction("");
    }
  }

  function exportCsv() {
    const csv = buildCsv(reservations);
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "reservas-tertulias-criollas.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-stone-100">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-400">
          Verificando acceso...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-stone-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8c39a]">
            Administración
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-4xl font-semibold tracking-[0.06em] text-white">
            Acceso privado
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            Ingresá la contraseña del panel para administrar las reservas.
          </p>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-7 min-h-14 w-full rounded-2xl border border-white/10 bg-black/45 px-4 text-center text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-white/35"
            placeholder="Contraseña"
          />
          {loginError ? (
            <p className="mt-4 rounded-2xl border border-red-300/25 bg-red-300/10 px-4 py-3 text-sm text-red-100">
              {loginError}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-full border border-white/30 bg-stone-100 px-5 py-4 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.2em] text-stone-950 transition hover:bg-white"
          >
            Ingresar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-100 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8c39a]">
              Administración
            </p>
            <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold tracking-[0.065em] text-white sm:text-6xl">
              Reservas
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-stone-100 transition hover:border-white/40 hover:bg-white/[0.12]"
            >
              Exportar CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#d8c39a]/30 bg-[#d8c39a]/10 px-5 py-3 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-[#ead8ad] transition hover:bg-[#d8c39a]/15"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Reservas recibidas", stats.totalReservations],
            ["Confirmadas", stats.confirmedReservations],
            ["Pendientes", stats.pendingReservations],
            ["Canceladas", stats.cancelledReservations],
            ["Cupos restantes", stats.remainingSeats]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
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

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, email o documento"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-white/35 lg:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full border px-4 py-2 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    filter === item.value
                      ? "border-[#d8c39a]/50 bg-[#d8c39a]/15 text-[#ead8ad]"
                      : "border-white/10 bg-black/20 text-stone-400 hover:border-white/25 hover:text-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1220px] text-left text-sm">
              <thead className="border-y border-white/10 bg-black/35 text-xs uppercase tracking-[0.18em] text-stone-500">
                <tr>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-4 py-4">Código de reserva</th>
                  <th className="px-4 py-4">Nombre</th>
                  <th className="px-4 py-4">Documento</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Teléfono</th>
                  <th className="px-4 py-4">Residencia</th>
                  <th className="px-4 py-4">Fecha de reserva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-stone-400" colSpan={8}>
                      Cargando reservas...
                    </td>
                  </tr>
                ) : null}

                {!isLoading && filteredReservations.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-stone-400" colSpan={8}>
                      No hay reservas para mostrar.
                    </td>
                  </tr>
                ) : null}

                {filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    onClick={() => setSelectedReservation(reservation)}
                    className="cursor-pointer text-stone-300 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-stone-200">
                        {statusLabels[reservation.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-[var(--font-heading)] text-base tracking-[0.05em] text-[#ead8ad]">
                      {reservation.publicCode ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-stone-100">
                      {reservation.nombreApellido}
                    </td>
                    <td className="px-4 py-4">{reservation.documento}</td>
                    <td className="px-4 py-4">{reservation.email}</td>
                    <td className="px-4 py-4">{reservation.telefono || "-"}</td>
                    <td className="px-4 py-4">{reservation.residencia}</td>
                    <td className="px-4 py-4">
                      {formatDate(reservation.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedReservation ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedReservation(null)}
        >
          <aside
            className="ml-auto flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-stone-950 p-6 shadow-[0_0_80px_rgba(0,0,0,0.45)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d8c39a]">
                  Detalle de reserva
                </p>
                <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-white">
                  {selectedReservation.nombreApellido}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.16em] text-stone-300 transition hover:border-white/30 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <dl className="mt-8 grid gap-4">
              {[
                ["Código de reserva", selectedReservation.publicCode ?? "Sin asignar"],
                ["Nombre completo", selectedReservation.nombreApellido],
                ["Documento", selectedReservation.documento],
                [
                  "Fecha de nacimiento",
                  formatBirthDate(selectedReservation.fechaNacimiento)
                ],
                ["Email", selectedReservation.email],
                ["Teléfono", selectedReservation.telefono || "-"],
                ["Residencia", selectedReservation.residencia],
                ["Fecha de creación", formatDate(selectedReservation.createdAt)],
                ["Estado", statusLabels[selectedReservation.status]]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <dt className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-stone-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Confirmar pago", "confirm"],
                ["Cancelar reserva", "cancel"],
                ["Reenviar email", "resend"],
                ["Marcar pendiente", "pending"]
              ].map(([label, action]) => (
                <button
                  key={action}
                  type="button"
                  onClick={() =>
                    runReservationAction(
                      selectedReservation.id,
                      action as "confirm" | "cancel" | "pending" | "resend"
                    )
                  }
                  disabled={activeAction === `${selectedReservation.id}-${action}`}
                  className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-3 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.16em] text-stone-100 transition hover:border-white/40 hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {activeAction === `${selectedReservation.id}-${action}`
                    ? "Procesando..."
                    : label}
                </button>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
