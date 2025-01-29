export function formatDecimal(num: number): string {
  // Convert to string without scientific notation
  return num.toLocaleString('fullwide', {
    useGrouping: false,
    maximumFractionDigits: 18,
  });
}
