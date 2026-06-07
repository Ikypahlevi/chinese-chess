export const withTimeout = (promise, timeoutMs = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Operation timeout")), timeoutMs),
    ),
  ]);
};

export function posToAlgebraic(posStr) {
  if (typeof posStr !== "string") return null;
  const parts = posStr.split(",");
  if (parts.length !== 2) return null;
  const row = parseInt(parts[0], 10);
  const col = parseInt(parts[1], 10);
  if (isNaN(row) || isNaN(col) || row < 0 || row > 9 || col < 0 || col > 8) return null;
  return "abcdefghi"[col] + "9876543210"[row];
}
