import { niceTicks } from "@/components/charts/nice-ticks";

describe("niceTicks", () => {
  it("renvoie une échelle par défaut sans données", () => {
    expect(niceTicks(0)).toEqual([0, 1]);
  });

  it("n'a jamais de graduations en double pour de petites valeurs", () => {
    for (let max = 1; max <= 10; max++) {
      const ticks = niceTicks(max);
      expect(new Set(ticks).size).toBe(ticks.length);
      expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(max);
    }
  });

  it("garde des pas ronds pour les grandes valeurs", () => {
    expect(niceTicks(100)).toEqual([0, 50, 100]);
    expect(niceTicks(20)).toEqual([0, 5, 10, 15, 20]);
    expect(niceTicks(1)).toEqual([0, 1]);
    expect(niceTicks(3)).toEqual([0, 1, 2, 3]);
  });
});
