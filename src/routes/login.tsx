import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap } from "lucide-react";
import { Panel } from "@/components/Shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Watt Wars" },
      { name: "description", content: "Join your room's team in the Watt Wars hostel energy challenge." },
      { property: "og:title", content: "Sign in — Watt Wars" },
      { property: "og:description", content: "Save Watts. Earn Points. Rule the Hostel." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [role, setRole] = useState<"student" | "warden">("student");
  const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";
  return (
    <div className="grid min-h-screen place-items-center grid-bg px-4">
      <Panel className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 font-display text-2xl font-bold text-primary text-glow"><Zap className="fill-primary" /> WATT WARS</div>
        <p className="mt-1 text-center text-sm text-muted-foreground">Save Watts. Earn Points. Rule the Hostel.</p>
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-md bg-muted p-1 text-sm">
          {(["student", "warden"] as const).map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`rounded py-1.5 capitalize ${role === r ? "bg-primary text-primary-foreground" : ""}`}>{r}</button>
          ))}
        </div>
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); nav({ to: role === "warden" ? "/admin" : "/" }); }}>
          {mode === "up" && <input className={input} placeholder="Full name" required />}
          <input className={input} type="email" placeholder="College email" required />
          {mode === "up" && role === "student" && <input className={input} placeholder="Room number (e.g. 204)" required />}
          <input className={input} type="password" placeholder="Password" required />
          <button className="w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground">{mode === "in" ? "Sign in" : "Create account"}</button>
        </form>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-center text-sm text-electric hover:underline">
          {mode === "in" ? "New here? Register your room" : "Have an account? Sign in"}
        </button>
      </Panel>
    </div>
  );
}
