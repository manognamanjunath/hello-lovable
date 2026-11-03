import { describe, it, expect } from "vitest";
import { savingScore } from "./energy";

describe("fair scoring vs own baseline", () => {
  it("rewards improvement, not raw low usage", () => {
    // Heavy room cutting 20 -> 14 beats light room staying at 8 -> 8
    expect(savingScore(20, 14)).toBeGreaterThan(savingScore(8, 8));
  });
  it("is 50 at baseline", () => {
    expect(savingScore(10, 10)).toBe(50);
  });
});
