import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Panel, PageTitle } from "@/components/Shell";
import { rooms, badgesFor } from "@/lib/energy";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Eco Coins & Badges — Watt Wars" },
      { name: "description", content: "Earn Eco Coins and unlock badges and hostel rewards by saving electricity." },
      { property: "og:title", content: "Eco Coins & Badges — Watt Wars" },
      { property: "og:description", content: "Unlock Green Hero, Energy Ninja and more." },
    ],
  }),
  component: Achievements,
});

const all = [
  { n: "Green Hero", i: "🌱", d: "Saving score 60+" },
  { n: "Energy Ninja", i: "🥷", d: "Saving score 75+" },
  { n: "Coin Collector", i: "🪙", d: "1000+ Eco Coins" },
  { n: "Steady Saver", i: "📉", d: "Today at or below normal" },
];
const rewards = [
  { n: "Canteen coupon ₹50", c: 300 },
  { n: "Laundry free wash", c: 500 },
  { n: "Weekly champion trophy", c: 800 },
  { n: "Late-night study room pass", c: 1200 },
];

function Achievements() {
  const [id, setId] = useState("101");
  const room = rooms.find((r) => r.id === id)!;
  const [coins, setCoins] = useState<Record<string, number>>({});
  const bal = coins[id] ?? room.coins;
  const owned = badgesFor(room);
  return (
    <Shell>
      <PageTitle kicker="Coins & Badges" title="Achievements" />
      <div className="mb-6 flex items-center gap-4">
        <select value={id} onChange={(e) => setId(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
          {rooms.map((r) => <option key={r.id}>{r.id}</option>)}
        </select>
        <span className="font-mono text-2xl text-warn">🪙 {bal} Eco Coins</span>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {all.map((b) => {
          const has = owned.includes(b.n);
          return (
            <Panel key={b.n} className={`text-center ${has ? "" : "opacity-40 grayscale"}`}>
              <div className="text-5xl">{b.i}</div>
              <div className="mt-2 font-display font-semibold">{b.n}</div>
              <div className="text-xs text-muted-foreground">{b.d}</div>
              <div className={`mt-2 text-xs ${has ? "text-primary" : "text-muted-foreground"}`}>{has ? "Unlocked" : "Locked"}</div>
            </Panel>
          );
        })}
      </div>
      <h2 className="mb-4 mt-10 font-display text-xl font-semibold">Reward store</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {rewards.map((r) => (
          <Panel key={r.n}>
            <div className="font-semibold">{r.n}</div>
            <div className="mt-1 font-mono text-warn">🪙 {r.c}</div>
            <button disabled={bal < r.c} onClick={() => setCoins({ ...coins, [id]: bal - r.c })} className="mt-3 w-full rounded-md bg-primary py-2 text-sm text-primary-foreground disabled:opacity-30">
              Redeem
            </button>
          </Panel>
        ))}
      </div>
    </Shell>
  );
}
