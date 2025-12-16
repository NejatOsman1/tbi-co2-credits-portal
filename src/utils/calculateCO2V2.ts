import { getCarbonByType } from "../data/productCatalog.js";

export function computeCO2Equivalent(
  elements: string | undefined,
  productType: string | undefined,
  aantal: number | undefined
): string | "" {
  if (!productType || !aantal || !elements) return "";

  let CO2Credits = 12;

  if (elements === "Dak" && productType === "Isolatie: stro") {
    CO2Credits = (0.32 * aantal * getCarbonByType(productType)) / 1000;
  }
  if (elements === "Dak" && productType === "Constructie: Hout") {
    CO2Credits =
      (0.27 * aantal * getCarbonByType(productType)) * 0.09 / 1000;
  }
  if (elements === "Dak" && productType === "Constructie: Spaanplaat") {
    CO2Credits =
      (0.029 * aantal * getCarbonByType(productType)) / 1000;
  }
  if (elements === "Binnenspouwblad" && productType === "Constructie: Hout") {
    CO2Credits =
      (0.27 * aantal * getCarbonByType(productType)) * 0.18 / 1000;
  }
  if (elements === "Binnenspouwblad" && productType === "Isolatie: houtvezels") {
    console.log(productType);
    CO2Credits = (0.27 * aantal * getCarbonByType(productType)) / 1000;
    console.log(CO2Credits);
  }
  if (elements === "Dak" && productType === "Constructie: Spaanplaat") {
    CO2Credits =
      (0.018 * aantal * getCarbonByType(productType)) / 1000;
  }

  return CO2Credits.toPrecision(2);
}

export function computeCO2Equivalent2(
  elements: string | undefined,
  aantal: number | undefined
): string | "" {
  if (!aantal || !elements) return "";

  let CO2Credits = 0;

  if (elements === "Dak") {
    CO2Credits += (0.32 * aantal * getCarbonByType("Isolatie: stro")) / 1000;
    CO2Credits += (0.27 * aantal * getCarbonByType("Constructie: Hout")) * 0.09 / 1000;
    // CO2Credits += (0.27 * aantal * getCarbonByType("Constructie: Spaanplaat")) * 0.09 / 1000;
    
  }
  if (elements === "Binnenspouwblad") {
    CO2Credits += (0.27 * aantal * getCarbonByType("Constructie: Hout")) * 0.18 / 1000;
    CO2Credits += (0.27 * aantal * getCarbonByType("Isolatie: houtvezels")) / 1000;
    // CO2Credits += (0.27 * aantal * getCarbonByType("Constructie: Spaanplaat")) * 0.09 / 1000;
  }
  return CO2Credits.toPrecision(2);
}



