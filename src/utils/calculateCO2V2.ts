import { getCarbonByType } from "../data/productCatalog.js";

export function computeCO2Equivalent(
  elements: string | undefined,
  productType: string | undefined,
  aantal: number | undefined
): number | "" {
  if (!productType || !aantal || !elements) return "";

  let CO2Credits = 12;

  if (elements === "Dak" && productType === "Fibers: stro") {
    CO2Credits = (0.32 * aantal * getCarbonByType(productType)) / 1000;
  }
  if (elements === "Dak" && productType === "Structural: Hout") {
    CO2Credits =
      (0.27 * aantal * getCarbonByType(productType)) * 0.09 / 1000;
  }
  if (elements === "Binnenspouwblad" && productType === "Structural: Hout") {
    CO2Credits =
      (0.27 * aantal * getCarbonByType(productType)) * 0.18 / 1000;
  }
  if (elements === "Binnenspouwblad" && productType === "Fibers: houtvezels") {
    console.log(productType);
    CO2Credits = (0.27 * aantal * getCarbonByType(productType)) / 1000;
  }

  return CO2Credits.toPrecision(2);
}