// ---- CO2 helpers ----
import { carbonByPair } from "./data/productCatalog";

type QuickRow = {
  fabrikant?: string;
  productCategory?: string;
  aantal?: number;
  eenheid?: string;
};

const CO2_BASELINE = 0.0001 * 10 * 450; // constant part

export function getCarbonForRow(row: QuickRow): number | undefined {
  if (!row?.fabrikant || !row?.productCategory) return undefined;
  const v = carbonByPair[row.fabrikant]?.[row.productCategory];
  return typeof v === "number" ? v : undefined;
}

export function calcTonCO2e(carbon: number, aantal: number | undefined): number {
  const qty = typeof aantal === "number" && !Number.isNaN(aantal) ? aantal : 1;
  return 0.0001 * carbon * qty - CO2_BASELINE;
}

export function formatTonCO2e(n: number | undefined): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function calcTotalTonCO2e(rows: QuickRow[] = []): number {
  return rows.reduce((sum, row) => {
    const carbon = getCarbonForRow(row);
    if (typeof carbon === "number") {
      sum += calcTonCO2e(carbon, row.aantal);
    }
    return sum;
  }, 0);
}
