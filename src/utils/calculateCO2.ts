// ---- CO2 helpers ----
import { carbonByPair } from "../data/productCatalog.js";

type QuickRow = {
  fabrikant?: string;
  productCategory?: string;
  aantal?: number;
  aantalM?: number;
  aantalM2?: number;
  eenheid?: string;
};

export function getQuantityForRow(row: QuickRow): number {
  // When unit is m3, calculate quantity as m * m2
  if (row.eenheid === "m3" && typeof row.aantalM === "number" && typeof row.aantalM2 === "number") {
    return row.aantalM * row.aantalM2;
  }
  return typeof row.aantal === "number" && !Number.isNaN(row.aantal) ? row.aantal : 1;
}

export function getCarbonForRow(row: QuickRow): number | undefined {
  if (!row?.fabrikant || !row?.productCategory) return undefined;
  const v = carbonByPair[row.fabrikant]?.[row.productCategory];
  return typeof v === "number" ? v : undefined;
}

export function calcTonCO2e(carbon: number, quantity: number | undefined, m2: number | undefined): number {

  const qty = typeof quantity === "number" && !Number.isNaN(quantity) ? quantity : 1;

  return  0.001 * carbon * qty;
}

export function formatTonCO2e(n: number | undefined): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function calcTotalTonCO2e(rows: QuickRow[] = [], aantalm2: number): number {
   const baseline = aantalm2 * 0.001 * 10;
  const total = rows.reduce((sum, row) => {
    const carbon = getCarbonForRow(row);

    if (typeof carbon === "number") {
      const qty = getQuantityForRow(row);
      sum += calcTonCO2e(carbon, qty, aantalm2);
    }

    return sum;
  }, 0);
  return -baseline - total;
}
