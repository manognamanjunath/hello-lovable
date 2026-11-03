import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Users } from "lucide-react";
import { Shell, Panel, PageTitle } from "@/components/Shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the Team — Watt Wars" },
      { name: "description", content: "Get in touch with the Watt Wars team about bringing the energy challenge to your hostel." },
      { property: "og:title", content: "Contact the Team — Watt Wars" },
      { property: "og:description", content: "Bring Watt Wars to your hostel." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";
  return (
    <Shell>
      <PageTitle kicker="Get in touch" title="Contact Us" sub="Want Watt Wars in your hostel, or have feedback? Send us a message." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          {sent ? (
            <div className="py-12 text-center">
              <div className="text-5xl">⚡</div>
              <p className="mt-3 font-display text-xl text-primary">Message sent!</p>
              <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="grid gap-3 md:grid-cols-2">
                <input className={input} placeholder="Your name" required />
                <input className={input} type="email" placeholder="Email" required />
              </div>
              <input className={input} placeholder="Hostel / Room number" />
              <textarea className={`${input} min-h-32`} placeholder="Your message" required />
              <button className="rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground">Send message</button>
            </form>
          )}
        </Panel>
        <Panel className="space-y-4 text-sm">
          <div className="flex gap-3"><Mail className="h-5 w-5 text-electric" /><span>team@wattwars.example</span></div>
          <div className="flex gap-3"><MapPin className="h-5 w-5 text-electric" /><span>Student Hostel, Block A</span></div>
          <div className="flex gap-3"><Users className="h-5 w-5 text-electric" /><span>Built for the hackathon by Team Watt Wars</span></div>
        </Panel>
      </div>
    </Shell>
  );
}
