import type { Tone } from "@/lib/contracts";

const tones: Record<Tone | "violet" | "cyan", string> = {
  safe: "bg-safe/10 text-safe ring-safe/30",
  warn: "bg-warn/10 text-warn ring-warn/30",
  threat: "bg-threat/10 text-threat ring-threat/30",
  muted: "bg-white/5 text-dim ring-white/10",
  violet: "bg-violet/15 text-violet-300 ring-violet/30",
  cyan: "bg-cyan/10 text-cyan ring-cyan/30",
};

export function Badge({ tone = "muted", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur ${className}`}>{children}</section>;
}

export function Stat({ label, value, hint, accent }: { label: string; value: React.ReactNode; hint?: string; accent: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-px ${accent}`} />
      <p className="text-xs uppercase tracking-wider text-dim">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-dim">{hint}</p>}
    </Card>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/5 ${className}`} />;
}

export const short = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");
