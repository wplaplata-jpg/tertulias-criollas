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

const statusStyles: Record<ReservationStatus, string> = {
  PENDING: "border-amber-200/25 bg-amber-200/10 text-amber-100",
  CONTACTED: "border-sky-200/25 bg-sky-200/10 text-sky-100",
  CONFIRMED: "border-emerald-200/25 bg-emerald-200/10 text-emerald-100",
  CANCELLED: "border-red-200/25 bg-red-200/10 text-red-100"
};

const exportStatusOrder: Record<ReservationStatus, number> = {
  CONFIRMED: 0,
  PENDING: 1,
  CONTACTED: 2,
  CANCELLED: 3
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

function getLastName(fullName: string) {
  const nameParts = fullName.trim().split(/\s+/);

  return nameParts.length > 1 ? nameParts[nameParts.length - 1] : fullName;
}

function sortReservationsForEvent(reservations: AdminReservation[]) {
  return [...reservations].sort((first, second) => {
    const statusDifference =
      exportStatusOrder[first.status] - exportStatusOrder[second.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return getLastName(first.nombreApellido).localeCompare(
      getLastName(second.nombreApellido),
      "es"
    );
  });
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildCsv(reservations: AdminReservation[]) {
  const headers = [
    "Nº",
    "Código",
    "Nombre y apellido",
    "Documento",
    "Fecha de nacimiento",
    "Residencia",
    "Teléfono",
    "Email",
    "Estado"
  ];

  const sortedReservations = sortReservationsForEvent(reservations);

  const rows = sortedReservations.map((reservation, index) => [
    index + 1,
    reservation.publicCode ?? "Sin asignar",
    reservation.nombreApellido,
    reservation.documento,
    formatBirthDate(reservation.fechaNacimiento),
    reservation.residencia,
    reservation.telefono ?? "",
    reservation.email,
    statusLabels[reservation.status]
  ]);

  const confirmedTotal = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED"
  ).length;

  return [
    ["Tertulias Criollas"],
    ["Listado oficial de asistentes"],
    ["Fecha de generación", formatDate(new Date().toISOString())],
    ["Cantidad de reservas confirmadas", confirmedTotal],
    [],
    headers,
    ...rows,
    [],
    ["Observaciones"],
    [""],
    [""],
    [""],
    [""],
    [""]
  ]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}

function buildPdfHtml(reservations: AdminReservation[]) {
  const sortedReservations = sortReservationsForEvent(reservations);
  const confirmedTotal = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED"
  ).length;
  const generatedAt = formatDate(new Date().toISOString());

  const rows = sortedReservations
    .map(
      (reservation, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(reservation.publicCode ?? "Sin asignar")}</td>
          <td>${escapeHtml(reservation.nombreApellido)}</td>
          <td>${escapeHtml(reservation.documento)}</td>
          <td>${escapeHtml(formatBirthDate(reservation.fechaNacimiento))}</td>
          <td>${escapeHtml(reservation.residencia)}</td>
          <td>${escapeHtml(reservation.telefono ?? "")}</td>
          <td>${escapeHtml(reservation.email)}</td>
          <td>${escapeHtml(statusLabels[reservation.status])}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Listado oficial de asistentes - Tertulias Criollas</title>
    <style>
      @page { margin: 18mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #1c1917;
        font-family: Georgia, "Times New Roman", serif;
        background: #ffffff;
      }
      header {
        border-bottom: 1px solid #bda56f;
        padding-bottom: 18px;
        margin-bottom: 22px;
      }
      .eyebrow {
        color: #8a733f;
        font-size: 11px;
        letter-spacing: 0.24em;
        margin: 0 0 8px;
        text-transform: uppercase;
      }
      h1 {
        font-size: 30px;
        line-height: 1.1;
        margin: 0;
      }
      .meta {
        display: grid;
        gap: 6px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 16px;
        font-size: 12px;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 11px;
      }
      th {
        background: #f3efe5;
        color: #4b3f26;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-align: left;
        text-transform: uppercase;
      }
      th, td {
        border: 1px solid #d8cfbc;
        padding: 7px 8px;
        vertical-align: top;
      }
      tr:nth-child(even) td { background: #fbfaf7; }
      .observations {
        margin-top: 26px;
        page-break-inside: avoid;
      }
      .observations h2 {
        color: #4b3f26;
        font-size: 16px;
        margin: 0 0 10px;
      }
      .line {
        border-bottom: 1px solid #d8cfbc;
        height: 28px;
      }
    </style>
  </head>
  <body>
    <header>
      <p class="eyebrow">Tertulias Criollas</p>
      <h1>Listado oficial de asistentes</h1>
      <div class="meta">
        <div><strong>Fecha de generación:</strong> ${escapeHtml(generatedAt)}</div>
        <div><strong>Reservas confirmadas:</strong> ${confirmedTotal}</div>
      </div>
    </header>
    <table>
      <thead>
        <tr>
          <th>Nº</th>
          <th>Código</th>
          <th>Nombre y apellido</th>
          <th>Documento</th>
          <th>Fecha de nacimiento</th>
          <th>Residencia</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <section class="observations">
      <h2>Observaciones</h2>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </section>
  </body>
</html>`;
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
    const csv = `\uFEFF${buildCsv(reservations)}`;
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

  function exportPdf() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setErrorMessage(
        "No se pudo abrir la ventana de impresión. Revisá el bloqueador de ventanas emergentes."
      );
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPdfHtml(reservations));
    printWindow.document.close();
    printWindow.focus();

    window.setTimeout(() => {
      printWindow.print();
    }, 250);
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(216,195,154,0.08),transparent_34%),#0a0a0a] px-4 py-10 text-stone-100 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[#d8c39a]/80">
              Administración
            </p>
            <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-none tracking-[0.065em] text-stone-50 sm:text-6xl">
              Reservas
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">
              Panel de control para seguimiento de solicitudes, cupos y
              confirmaciones de la próxima velada.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-stone-100 transition hover:border-white/40 hover:bg-white/[0.12]"
            >
              Generar CSV
            </button>
            <button
              type="button"
              onClick={exportPdf}
              className="rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 font-[var(--font-heading)] text-xs font-semibold uppercase tracking-[0.18em] text-stone-100 transition hover:border-white/40 hover:bg-white/[0.12]"
            >
              Generar PDF
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

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Solicitudes recibidas", stats.totalReservations],
            ["Confirmadas", stats.confirmedReservations],
            ["Pendientes", stats.pendingReservations],
            ["Cupos disponibles", stats.remainingSeats]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-[#d8c39a]/15 bg-white/[0.035] p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                {label}
              </p>
              <p className="mt-3 font-[var(--font-heading)] text-4xl text-[#ead8ad]">
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

        <section className="mt-8 rounded-[2rem] border border-[#d8c39a]/15 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
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
              <thead className="border-y border-[#d8c39a]/15 bg-black/40 text-xs uppercase tracking-[0.18em] text-stone-500">
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
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusStyles[reservation.status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
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
                    {label === "Estado" ? (
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusStyles[selectedReservation.status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {value}
                      </span>
                    ) : (
                      value
                    )}
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
