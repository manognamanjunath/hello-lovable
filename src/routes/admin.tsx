import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar as RBar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Shell, Panel, PageTitle } from "@/components/Shell";
import { rooms, roomScore, anomalyPct } from "@/lib/energy";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Warden Control Room — Watt Wars" },
      { name: "description", content: "Monitor rooms, compare floors, create competitions and publish announcements." },
      { property: "og:title", content: "Warden Control Room — Watt Wars" },
      { property: "og:description", content: "Hostel energy analytics for wardens." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const floors = [1, 2, 3, 4].map((f) => ({ floor: `Floor ${f}`, kwh: Math.round(rooms.filter((r) => r.floor === f).reduce((a, r) => a + r.today, 0)) }));
  const [comps, setComps] = useState(["The Power Hunter (this week)"]);
  const [news, setNews] = useState(["Lights-off hour every Sunday 8–9 PM!"]);
  const [c, setC] = useState("");
  const [n, setN] = useState("");
  const input = "flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm";
  return (
    <Shell>
      <PageTitle kicker="Admin Panel" title="Warden Control Room" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="font-display font-semibold">Floor-wise consumption today</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floors}>
                <XAxis dataKey="floor" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <RBar dataKey="kwh" fill="var(--electric)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <h2 className="font-display font-semibold">Competitions</h2>
          <ul className="mt-3 space-y-2 text-sm">{comps.map((x) => <li key={x} className="rounded bg-primary/10 px-3 py-2 text-primary">⚡ {x}</li>)}</ul>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (c.trim()) { setComps([...comps, c]); setC(""); } }}>
            <input className={input} value={c} onChange={(e) => setC(e.target.value)} placeholder="New competition name" />
            <button className="rounded-md bg-primary px-4 text-sm text-primary-foreground">Create</button>
          </form>
          <h2 className="mt-6 font-display font-semibold">Announcements</h2>
          <ul className="mt-3 space-y-2 text-sm">{news.map((x) => <li key={x} className="rounded bg-electric/10 px-3 py-2">📢 {x}</li>)}</ul>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (n.trim()) { setNews([n, ...news]); setN(""); } }}>
            <input className={input} value={n} onChange={(e) => setN(e.target.value)} placeholder="Write an announcement" />
            <button className="rounded-md bg-electric px-4 text-sm text-background">Publish</button>
          </form>
        </Panel>
      </div>
      <Panel className="mt-4 overflow-x-auto">
        <h2 className="font-display font-semibold">All rooms report</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="py-2">Room</th><th>Block</th><th>Occupants</th><th>Normal</th><th>Today</th><th>Change</th><th>Score</th></tr></thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2 font-semibold">{r.id}</td><td>{r.block}</td><td>{r.occupants.join(", ")}</td>
                <td className="font-mono">{r.baseline}</td><td className="font-mono">{r.today}</td>
                <td className={`font-mono ${anomalyPct(r) > 0 ? "text-warn" : "text-primary"}`}>{anomalyPct(r) > 0 ? "+" : ""}{anomalyPct(r)}%</td>
                <td className="font-mono text-primary">{roomScore(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Shell>
  );
}
