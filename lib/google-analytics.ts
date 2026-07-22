export function normalizeAnalyticsId(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidGa4Id(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id.trim());
}
