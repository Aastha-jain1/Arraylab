// Parses "10, 20 30" into [10,20,30]. Returns null if invalid (max 12 whole numbers).
export const parseList = (t) => {
  const p = t.split(/[\s,]+/).filter(Boolean);
  if (!p.length || p.length > 12) return null;
  const n = p.map(Number);
  return n.every((x) => Number.isInteger(x) && Math.abs(x) < 1e6) ? n : null;
};
// Strict whole-number parser for form fields. Returns null if not an integer.
export const toInt = (s) => {
  const t = String(s).trim();
  return /^-?\d+$/.test(t) ? Number(t) : null;
};
