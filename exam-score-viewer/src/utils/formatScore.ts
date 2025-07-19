export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return "0.0";
  return score.toFixed(1);
}