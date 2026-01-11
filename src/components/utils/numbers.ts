export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
