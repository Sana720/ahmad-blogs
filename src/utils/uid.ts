export function uid() {
  // simple short id generator (not cryptographically strong) sufficient for toast ids
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}
