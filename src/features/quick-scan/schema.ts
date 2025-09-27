import { z } from "zod";
import { productsByManufacturer } from "../../data/productCatalog";

const isValidPair = (m?: string, p?: string) =>
  !!m && !!p && Array.isArray(productsByManufacturer[m]) && productsByManufacturer[m].includes(p as string);

export const quickScanRow = z.object({
  fabrikant: z.string().min(1, "Kies een fabrikant"),
  productCategory: z.string().min(1, "Kies een product"),
  aantal: z.number().positive({ message: "Voer een positief getal in" }),
  eenheid: z.string().min(1, "Verplicht veld"),
});

export const requireAtLeastOneQuickItem = z
  .object({
    quickScan: z.array(quickScanRow).min(1, "Voeg minimaal één item toe"),
  })
  .superRefine((data, ctx) => {
    data.quickScan?.forEach((row, idx) => {
      if (!isValidPair(row.fabrikant, row.productCategory)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quickScan", idx, "productCategory"],
          message: "Product hoort niet bij de gekozen fabrikant",
        });
      }
    });
  });
