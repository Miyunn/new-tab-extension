export const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";

export const isNumber = (v: unknown): v is number =>
  typeof v === "number" && !Number.isNaN(v);

export const isString = (v: unknown): v is string => typeof v === "string";

export const oneOf = <T extends readonly string[]>(
  v: unknown,
  allowed: T,
): v is T[number] => typeof v === "string" && allowed.includes(v);
