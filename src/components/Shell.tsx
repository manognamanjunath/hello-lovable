import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/battles", label: "Room Battles" },
  { to: "/wattbot", label: "WattBot" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/achievements", label: "Achievements" },
  { to: "/impact", label: "Green Impact" },
  { to: "/admin", label: "Warden" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid-bg">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <Zap className="h-6 w-6 fill-primary" /> WATT WARS
          </Link>
          <nav className="flex flex-1 flex-wrap gap-1 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "bg-primary/15 text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/login" className="rounded-md border border-primary/50 px-3 py-1.5 text-sm text-primary hover:bg-primary/10">
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="py-8 text-center text-xs text-muted-foreground">
        Save Watts. Earn Points. Rule the Hostel. · Demo uses simulated room meters.
      </footer>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card/70 p-5 shadow-glow ${className}`}>{children}</div>;
}

export function Stat({ label, value, sub, tone = "primary" }: { label: string; value: string; sub?: string; tone?: "primary" | "electric" | "warn" }) {
  const c = tone === "primary" ? "text-primary" : tone === "electric" ? "text-electric" : "text-warn";
  return (
    <Panel>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-2 font-mono text-3xl font-bold ${c}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </Panel>
  );
}

export function PageTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-electric">{kicker}</div>
      <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{title}</h1>
      {sub && <p className="mt-2 max-w-2xl text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "electric" }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${tone === "primary" ? "bg-primary" : "bg-electric"}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
