import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Shell, Panel, PageTitle } from "@/components/Shell";
import { rooms, tipsFor, answer } from "@/lib/energy";

export const Route = createFileRoute("/wattbot")({
  head: () => ({
    meta: [
      { title: "WattBot — Room Energy Tips | Watt Wars" },
      { name: "description", content: "Personalised room-wise electricity saving tips from WattBot." },
      { property: "og:title", content: "WattBot — Room Energy Tips" },
      { property: "og:description", content: "Your room's personal energy assistant." },
    ],
  }),
  component: WattBot,
});

function WattBot() {
  const [roomId, setRoomId] = useState("204");
  const room = rooms.find((r) => r.id === roomId)!;
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([]);
  const [q, setQ] = useState("");
  const ask = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { me: true, t: text }, { me: false, t: answer(room, text) }]);
    setQ("");
  };

  return (
    <Shell>
      <PageTitle kicker="AI Energy Assistant" title="WattBot" sub="Room-specific suggestions based on your own usage pattern." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <label className="text-sm text-muted-foreground">Your room</label>
          <select value={roomId} onChange={(e) => { setRoomId(e.target.value); setMsgs([]); }} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2">
            {rooms.map((r) => <option key={r.id}>{r.id}</option>)}
          </select>
          <h3 className="mt-5 font-display font-semibold">Today's tips</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {tipsFor(room).map((t) => (
              <li key={t} className="rounded-lg border border-primary/30 bg-primary/5 p-3">💡 {t}</li>
            ))}
          </ul>
        </Panel>
        <Panel className="flex min-h-[28rem] flex-col lg:col-span-2">
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="flex gap-2"><Bot className="h-6 w-6 shrink-0 text-electric" /><div className="rounded-lg bg-muted p-3 text-sm">Hi Room {room.id}! Ask me why usage is high, your rank, bill, or CO₂ saved.</div></div>
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.me ? "justify-end" : ""}`}>
                {!m.me && <Bot className="h-6 w-6 shrink-0 text-electric" />}
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.me ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.t}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Why is my usage high?", "What's my rank?", "How much is my bill?", "CO₂ saved?"].map((s) => (
              <button key={s} onClick={() => ask(s)} className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary hover:text-primary">{s}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="mt-3 flex gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask WattBot…" className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button className="rounded-md bg-primary px-4 text-primary-foreground" aria-label="Send"><Send className="h-4 w-4" /></button>
          </form>
        </Panel>
      </div>
    </Shell>
  );
}
