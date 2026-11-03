import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Swords } from "lucide-react";
import { Shell, Panel, PageTitle, Bar } from "@/components/Shell";
import { rooms, roomScore } from "@/lib/energy";

export const Route = createFileRoute("/battles")({
  head: () => ({
    meta: [
      { title: "Room Battles — Watt Wars" },
      { name: "description", content: "Room vs room weekly energy-saving battles and the Power Hunter boss battle." },
      { property: "og:title", content: "Room Battles — Watt Wars" },
      { property: "og:description", content: "Challenge another room and win Eco Coins." },
    ],
  }),
  component: Battles,
});

function Battles() {
  const [a, setA] = useState("101");
  const [b, setB] = useState("102");
  const ra = rooms.find((r) => r.id === a)!;
  const rb = rooms.find((r) => r.id === b)!;
  const sa = roomScore(ra), sb = roomScore(rb);
  const leader = sa >= sb ? ra : rb;
  const pairs = [["103", "104"], ["201", "202"], ["301", "302"], ["401", "403"]];

  return (
    <Shell>
      <PageTitle kicker="Weekly Boss Battle" title="⚡ The Power Hunter" sub="Reduce unnecessary consumption this week. Scored on improvement vs each room's own normal usage — fair for every room." />
      <Panel className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <select value={a} onChange={(e) => setA(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
            {rooms.map((r) => <option key={r.id}>{r.id}</option>)}
          </select>
          <Swords className="h-6 w-6 text-electric" />
          <select value={b} onChange={(e) => setB(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
            {rooms.map((r) => <option key={r.id}>{r.id}</option>)}
          </select>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {[[ra, sa], [rb, sb]].map(([r, s]) => {
            const room = r as typeof ra;
            return (
              <div key={room.id}>
                <div className="text-muted-foreground">Room {room.id}</div>
                <div className={`font-display text-6xl font-bold ${room.id === leader.id ? "text-primary text-glow" : "text-electric"}`}>{s as number}%</div>
                <div className="mt-3"><Bar value={s as number} tone={room.id === leader.id ? "primary" : "electric"} /></div>
                <div className="mt-2 text-xs text-muted-foreground">{room.occupants.join(" & ")}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-lg font-semibold text-primary">
          <Trophy className="h-6 w-6" /> {a === b ? "Pick two different rooms" : `Room ${leader.id} leads the challenge`}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          {["500 Eco Coins", "Golden Green Champion badge", "Monthly leaderboard bonus"].map((x) => (
            <span key={x} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">{x}</span>
          ))}
        </div>
      </Panel>

      <h2 className="mb-4 mt-10 font-display text-xl font-semibold">Other live battles</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {pairs.map(([x, y]) => {
          const rx = rooms.find((r) => r.id === x)!, ry = rooms.find((r) => r.id === y)!;
          const px = roomScore(rx), py = roomScore(ry);
          return (
            <Panel key={x}>
              <div className="flex justify-between font-mono"><span>Room {x}: {px}%</span><span>Room {y}: {py}%</span></div>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full">
                <div className="bg-primary" style={{ width: `${(px / (px + py || 1)) * 100}%` }} />
                <div className="flex-1 bg-electric" />
              </div>
            </Panel>
          );
        })}
      </div>
    </Shell>
  );
}
