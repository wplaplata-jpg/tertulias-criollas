import Link from "next/link";

type ReserveButtonProps = {
  label: string;
};

export function ReserveButton({ label }: ReserveButtonProps) {
  return (
    <Link
      href="/reserva"
      className="rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 font-[var(--font-heading)] text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.14] hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-7 sm:text-base sm:tracking-[0.24em]"
    >
      {label}
    </Link>
  );
}
