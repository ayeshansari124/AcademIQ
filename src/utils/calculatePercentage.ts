export function calculatePercentage(
  obtained: number,
  total: number
) {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
}
