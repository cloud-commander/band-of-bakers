export function formatOrderReference(id: string, orderNumber?: number | null): string {
  if (orderNumber && orderNumber > 0) {
    return `ORDR-${orderNumber.toString().padStart(5, "0")}`;
  }
  const cleaned = id.replace(/^ord[-_]?/i, "").replace(/[^A-Za-z0-9]/g, "");
  const shortRef = cleaned.slice(0, 6).toUpperCase() || "ORDER";
  return `ORDR-${shortRef}`;
}
