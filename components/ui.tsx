import type { Tone } from "@/lib/contracts";

const tones: Record<Tone | "violet" | "cyan", string> = {
  safe: "bg-safe/10 text-safe ring-safe/30",
  warn: "bg-warn/10 text-warn ring-warn/30",
  threat: "bg-threat/10 text-threat ring-threat/30",
  muted: "bg-surface-3 text-muted ring-border",
  violet: "bg-brand/15 text-brand ring-brand/30",
  cyan: "bg-accent/15 text-accent ring-accent/30",
};

export function Badge({ tone = "muted", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-6 backdrop-blur transition-all duration-200 ${className}`}>
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, accent }: { label: string; value: React.ReactNode; hint?: string; accent?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-brand/40">
      {accent && <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />}
      <p className="text-xs uppercase tracking-wider text-muted font-semibold">{label}</p>
      <p className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-3 ${className}`} />;
}

export const short = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");
