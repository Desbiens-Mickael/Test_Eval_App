/** Graduations "rondes" pour un axe allant de 0 à max */
export const niceTicks = (max: number, maxTicks = 4) => {
  if (max <= 0) return [0, 1];
  const rough = max / maxTicks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ??
    10 * magnitude;
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v));
  return ticks;
};
