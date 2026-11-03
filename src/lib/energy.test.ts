import { describe, it, expect } from "vitest";
import { savingScore, isPowerCut } from "./energy";

describe("fair scoring vs own baseline", () => {
  it("rewards improvement, not raw low usage", () => {
    // Heavy room cutting 20 -> 14 beats light room staying at 8 -> 8
    expect(savingScore(20, 14)).toBeGreaterThan(savingScore(8, 8));
  });
  it("is 50 at baseline", () => {
    expect(savingScore(10, 10)).toBe(50);
  });
});

describe("power cut", () => {
  it("cuts after 3 straight days above normal", () => {
    expect(isPowerCut({ baseline: 10, week: [5, 5, 5, 5, 11, 12, 13] })).toBe(true);
  });
  it("does not cut after only 2 days", () => {
    expect(isPowerCut({ baseline: 10, week: [5, 5, 5, 5, 9, 12, 13] })).toBe(false);
  });
});
