// Simulated hostel energy data (no smart meters yet — sample data with live jitter).
export type Room = {
  id: string;
  floor: number;
  block: string;
  occupants: string[];
  baseline: number; // normal kWh per day
  today: number; // kWh so far today
  week: number[]; // last 7 days kWh
  coins: number;
  badges: string[];
};

export const RATE_PER_KWH = 8; // ₹ per unit
export const CO2_PER_KWH = 0.82; // kg CO2 per kWh (India grid avg)

const names = ["Aarav", "Diya", "Kabir", "Isha", "Rohan", "Meera", "Arjun", "Sana", "Vikram", "Ananya", "Dev", "Priya", "Neel", "Tara", "Kiran", "Riya"];

function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const rooms: Room[] = Array.from({ length: 16 }, (_, i) => {
  const floor = Math.floor(i / 4) + 1;
  const id = `${floor}0${(i % 4) + 1}`;
  const baseline = Math.round((9 + seeded(i) * 6) * 10) / 10;
  const factor = 0.6 + seeded(i + 50) * 0.75;
  const week = Array.from({ length: 7 }, (_, d) =>
    Math.round(baseline * (factor + (seeded(i * 7 + d) - 0.5) * 0.3) * 10) / 10,
  );
  if (id === "204") week[6] = 18; // anomaly showcase
  if (id === "302") for (const d of [4, 5, 6]) week[d] = Math.round(baseline * 1.35 * 10) / 10; // power-cut showcase
  return {
    id,
    floor,
    block: i < 8 ? "A" : "B",
    occupants: [names[i]!, names[(i + 5) % 16]!],
    baseline: id === "204" ? 10 : baseline,
    today: week[6]!,
    week,
    coins: Math.round(200 + seeded(i + 99) * 1400),
    badges: [],
  };
});

/** Fair score: improvement vs. the room's OWN normal usage, not raw lowest usage. */
export function savingScore(baseline: number, actual: number) {
  if (baseline <= 0) return 0;
  const pct = ((baseline - actual) / baseline) * 100;
  return Math.max(0, Math.min(100, Math.round(50 + pct * 1.5)));
}

export function weekAvg(r: Room) {
  return r.week.reduce((a, b) => a + b, 0) / r.week.length;
}

export function roomScore(r: Room) {
  return savingScore(r.baseline, weekAvg(r));
}

export function anomalyPct(r: Room) {
  return Math.round(((r.today - r.baseline) / r.baseline) * 100);
}

export function badgesFor(r: Room) {
  const s = roomScore(r);
  const b: string[] = [];
  if (s >= 60) b.push("Green Hero");
  if (s >= 75) b.push("Energy Ninja");
  if (r.coins >= 1000) b.push("Coin Collector");
  if (anomalyPct(r) <= 0) b.push("Steady Saver");
  return b;
}

export function leaderboard() {
  return [...rooms].sort((a, b) => roomScore(b) - roomScore(a));
}

export function tipsFor(r: Room): string[] {
  const a = anomalyPct(r);
  const tips: string[] = [];
  if (a > 40)
    tips.push(`Room ${r.id}, today's usage is ${a}% above your normal ${r.baseline} kWh. Check for a heater, iron or kettle left on.`);
  else if (a > 0)
    tips.push(`Room ${r.id}, you're ${a}% above normal. Switch off lights and fans when you leave.`);
  else tips.push(`Great job Room ${r.id}! You're ${Math.abs(a)}% below your normal usage. Keep the streak alive.`);
  const peak = Math.max(...r.week);
  const peakDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][r.week.indexOf(peak)];
  tips.push(`Your highest day this week was ${peakDay} (${peak} kWh). Plan laptop charging during daylight to cut late-night load.`);
  tips.push("Unplug phone chargers and set monitors to sleep — standby power is up to 10% of a room's bill.");
  tips.push("Set the AC/fan to a moderate speed and use natural light before 5 PM.");
  return tips;
}

export function answer(r: Room, q: string) {
  const t = q.toLowerCase();
  const avg = weekAvg(r);
  if (/rank|position|leader/.test(t)) {
    const pos = leaderboard().findIndex((x) => x.id === r.id) + 1;
    return `Room ${r.id} is ranked #${pos} of ${rooms.length} with a saving score of ${roomScore(r)}.`;
  }
  if (/bill|cost|money|₹|rupee/.test(t))
    return `At ₹${RATE_PER_KWH}/unit, your week costs about ₹${Math.round(avg * 7 * RATE_PER_KWH)}. Cutting 1 kWh/day saves ₹${RATE_PER_KWH * 30}/month.`;
  if (/why|high|spike|unusual/.test(t))
    return anomalyPct(r) > 20
      ? `Usage is ${anomalyPct(r)}% above normal. Likely causes: a heater/immersion rod, an iron, devices charging overnight, or lights left on while away.`
      : `Nothing unusual — you're within ${Math.abs(anomalyPct(r))}% of normal.`;
  if (/co2|carbon|planet/.test(t)) {
    const saved = Math.max(0, (r.baseline - avg) * 7);
    return `This week you avoided about ${(saved * CO2_PER_KWH).toFixed(1)} kg of CO₂ — roughly ${Math.round(saved * CO2_PER_KWH / 0.06)} smartphone charges' worth.`;
  }
  return tipsFor(r)[Math.floor(Math.random() * 4)] ?? "";
}

/** Consecutive most-recent days where usage was above the room's normal. */
export function overStreak(r: Pick<Room, "week" | "baseline">) {
  let n = 0;
  for (let i = r.week.length - 1; i >= 0 && r.week[i]! > r.baseline; i--) n++;
  return n;
}

export const POWER_CUT_DAYS = 3;
export function isPowerCut(r: Pick<Room, "week" | "baseline">) {
  return overStreak(r) >= POWER_CUT_DAYS;
}
