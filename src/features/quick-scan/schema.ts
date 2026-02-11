import { z } from "zod";
import { productsByManufacturer } from "../../data/productCatalog";

// Import these from your first schema or redefine them
const productTypes = [
  "Constructie: Hout",
  "Constructie: Spaanplaat",
  "Constructie: CLT or LVL",
  "Constructie: Bamboo",
  "Isolatie: houtvezels",
  "Isolatie: stro",
  "Isolatie: hemp or flax",
  "Composiet: wood-based",
  "Composiet: mycelium-based",
  "Composiet: conrete based",
] as const;

const elements = [
  "Dak",
  "Binnenspouwblad",
  "Binnenwanden",
  "Vloeren",
] as const;

const isValidPair = (m?: string, p?: string) =>
  !!m && !!p && Array.isArray(productsByManufacturer[m]) && productsByManufacturer[m].includes(p as string);

export const quickScanRow = z.object({
  element: z.enum(elements).optional(), // Now editable with proper enum
  productType: z.enum(productTypes).optional(), // Now editable with proper enum
  fabrikant: z.string().min(1, "Kies een fabrikant"),
  productCategory: z.string().min(1, "Kies een product"),
  aantal: z.number().positive({ message: "Voer een positief geval in" }),
  eenheid: z.string().optional()
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