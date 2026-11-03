import { createFileRoute } from "@tanstack/react-router";
import { Shell, Stat, PageTitle, Panel, Bar } from "@/components/Shell";
import { rooms, weekAvg, RATE_PER_KWH, CO2_PER_KWH, roomScore } from "@/lib/energy";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Green Impact Tracker — Watt Wars" },
      { name: "description", content: "kWh saved, money saved and CO₂ avoided by the hostel." },
      { property: "og:title", content: "Green Impact Tracker — Watt Wars" },
      { property: "og:description", content: "See the planet-sized impact of switching off." },
    ],
  }),
  component: Impact,
});

function Impact() {
  const saved = rooms.reduce((a, r) => a + Math.max(0, r.baseline - weekAvg(r)), 0) * 30;
  const co2 = saved * CO2_PER_KWH;
  const score = Math.round(rooms.reduce((a, r) => a + roomScore(r), 0) / rooms.length);
  return (
    <Shell>
      <PageTitle kicker="CO₂ Savings" title="Green Impact Tracker" sub="Monthly projection based on this week's savings." />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Electricity saved" value={`${Math.round(saved)} kWh`} />
        <Stat label="Money saved" value={`₹${Math.round(saved * RATE_PER_KWH).toLocaleString()}`} tone="electric" />
        <Stat label="CO₂ avoided" value={`${Math.round(co2)} kg`} />
        <Stat label="Trees equivalent" value={`${Math.round(co2 / 21)} 🌳`} sub="~21 kg CO₂ per tree / year" tone="electric" />
      </div>
      <Panel className="mt-4">
        <h2 className="font-display font-semibold">Hostel sustainability score</h2>
        <div className="mt-3 font-mono text-5xl font-bold text-primary text-glow">{score}/100</div>
        <div className="mt-3"><Bar value={score} /></div>
      </Panel>
    </Shell>
  );
}
