import { createFileRoute } from "@tanstack/react-router";
import { Shell, Panel, PageTitle, Bar } from "@/components/Shell";
import { leaderboard, roomScore, rooms } from "@/lib/energy";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Watt Wars" },
      { name: "description", content: "Top energy-saving hostel rooms and the Hostel Green League." },
      { property: "og:title", content: "Leaderboard — Watt Wars" },
      { property: "og:description", content: "Who is this month's Green Champion?" },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const list = leaderboard();
  const blocks = ["A", "B"].map((b) => {
    const rs = rooms.filter((r) => r.block === b);
    return { b, score: Math.round(rs.reduce((a, r) => a + roomScore(r), 0) / rs.length) };
  });
  const medal = ["🥇", "🥈", "🥉"];
  return (
    <Shell>
      <PageTitle kicker="Top Rooms" title="Live Leaderboard" sub="Ranked by improvement against each room's own normal usage." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="space-y-2">
            {list.map((r, i) => (
              <div key={r.id} className={`grid grid-cols-[3rem_5rem_1fr_4rem_5rem] items-center gap-3 rounded-lg px-3 py-2 ${i === 0 ? "bg-primary/10" : ""}`}>
                <span className="font-mono text-lg">{medal[i] ?? `#${i + 1}`}</span>
                <span className="font-semibold">Room {r.id}</span>
                <Bar value={roomScore(r)} tone={i < 3 ? "primary" : "electric"} />
                <span className="font-mono text-primary">{roomScore(r)}</span>
                <span className="text-right font-mono text-xs text-warn">🪙 {r.coins}</span>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel className="text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Monthly Green Champion</div>
            <div className="mt-2 text-5xl">🏆</div>
            <div className="mt-2 font-display text-2xl font-bold text-primary text-glow">Room {list[0]!.id}</div>
            <div className="text-sm text-muted-foreground">{list[0]!.occupants.join(" & ")}</div>
          </Panel>
          <Panel>
            <h3 className="font-display font-semibold">Hostel Green League</h3>
            {blocks.map((x) => (
              <div key={x.b} className="mt-3">
                <div className="flex justify-between text-sm"><span>Block {x.b}</span><span className="font-mono">{x.score}</span></div>
                <Bar value={x.score} tone="electric" />
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
