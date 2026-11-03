import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar as RBar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, PowerOff } from "lucide-react";
import { Shell, Panel, Stat, PageTitle, Bar } from "@/components/Shell";
import { rooms, RATE_PER_KWH, weekAvg, roomScore, anomalyPct, isPowerCut, overStreak, POWER_CUT_DAYS } from "@/lib/energy";

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 880;
      g.gain.value = 0.08;
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.2);
    });
  } catch {}
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Watt Wars — Hostel Energy Command Center" },
      { name: "description", content: "Live hostel electricity dashboard with room-wise usage, savings and energy score." },
      { property: "og:title", content: "Watt Wars — Hostel Energy Command Center" },
      { property: "og:description", content: "Save Watts. Earn Points. Rule the Hostel." },
    ],
  }),
  component: Dashboard,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Dashboard() {
  const [live, setLive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setLive((v) => v + 1), 2000);
    return () => clearInterval(t);
  }, []);
  const jitter = (n: number) => n + Math.sin(live * 1.3) * 0.4;
  const todayTotal = jitter(rooms.reduce((a, r) => a + r.today, 0));
  const baselineTotal = rooms.reduce((a, r) => a + r.baseline, 0);
  const savedMonth = rooms.reduce((a, r) => a + Math.max(0, r.baseline - weekAvg(r)), 0) * 30;
  const score = Math.round(rooms.reduce((a, r) => a + roomScore(r), 0) / rooms.length);
  const trend = days.map((d, i) => ({ d, kwh: Math.round(rooms.reduce((a, r) => a + (r.week[i] ?? 0), 0)), base: Math.round(baselineTotal) }));
  const alerts = rooms.filter((r) => r.today > r.baseline && !isPowerCut(r));
  const cuts = rooms.filter(isPowerCut);
  useEffect(() => {
    if (alerts.length + cuts.length === 0) return;
    beep();
    const once = () => { beep(); window.removeEventListener("pointerdown", once); };
    window.addEventListener("pointerdown", once);
    return () => window.removeEventListener("pointerdown", once);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const roomBars = rooms.map((r) => ({ id: r.id, today: r.today, normal: r.baseline }));

  return (
    <Shell>
      <PageTitle kicker="Energy Command Center" title="Block A & B — Live Overview" sub="Every room competes against its own normal usage. Cut waste, earn Eco Coins, become the Green Champion." />
      <div className="grid gap-4 md:grid-cols-5">
        <Stat label="Today's usage" value={`${todayTotal.toFixed(1)} kWh`} sub={`Normal: ${baselineTotal.toFixed(0)} kWh`} />
        <Stat label="Total this month" value={`${Math.round(baselineTotal * 30 - savedMonth)} kWh`} tone="electric" />
        <Stat label="Saved this month" value={`${Math.round(savedMonth)} kWh`} />
        <Stat label="Estimated bill" value={`₹${Math.round((baselineTotal * 30 - savedMonth) * RATE_PER_KWH).toLocaleString()}`} tone="electric" />
        <Panel>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Live saving score</div>
          <div className="mt-2 font-mono text-3xl font-bold text-primary">{score}<span className="text-base">/100</span></div>
          <div className="mt-3"><Bar value={score} /></div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h2 className="font-display font-semibold">Hostel usage this week</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Area dataKey="base" name="Normal" stroke="var(--electric)" strokeDasharray="4 4" fill="none" />
                <Area dataKey="kwh" name="Actual" stroke="var(--primary)" fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 font-display font-semibold"><AlertTriangle className="h-4 w-4 text-warn" /> Energy Detective</h2>
          <div className="mt-4 max-h-96 space-y-3 overflow-y-auto">
            {cuts.map((r) => (
              <div key={r.id} className="animate-pulse rounded-lg border border-destructive bg-destructive/15 p-3 text-sm">
                <div className="flex items-center gap-2 font-semibold text-destructive"><PowerOff className="h-4 w-4" /> Room {r.id} — POWER CUT</div>
                <div className="text-muted-foreground">Above normal for {overStreak(r)} days in a row (limit {POWER_CUT_DAYS}). Supply switched off until the warden resets it.</div>
              </div>
            ))}
            {alerts.map((r) => (
              <div key={r.id} className="rounded-lg border border-warn/40 bg-warn/10 p-3 text-sm">
                <div className="font-semibold">Room {r.id}</div>
                <div className="text-muted-foreground">Normal {r.baseline} kWh → now {r.today} kWh</div>
                <div className="mt-1 font-mono text-warn">🔊 ⚠ {anomalyPct(r)}% above normal</div>
                <div className="mt-1 text-xs text-muted-foreground">Check: heater, iron, kettle, lights left on.</div>
              </div>
            ))}
            {alerts.length + cuts.length === 0 && <p className="text-sm text-muted-foreground">No unusual usage. 🎉</p>}
            <Link to="/wattbot" className="block text-sm text-electric hover:underline">Ask WattBot for tips →</Link>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <h2 className="font-display font-semibold">Room-wise usage today vs normal</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomBars}>
              <XAxis dataKey="id" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
              <RBar dataKey="normal" fill="var(--electric)" radius={[4, 4, 0, 0]} opacity={0.5} />
              <RBar dataKey="today" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </Shell>
  );
}
