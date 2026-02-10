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
  if (elements === "Binnenspouwblad" && productType === "Constructie: Spaanplaat") {
    CO2Credits =
      (0.018 * aantal * getCarbonByType(productType)) / 1000;
  }
  if (productType === "Isolatie: hemp or flax") {
    CO2Credits = (aantal * getCarbonByType(productType)) / 1000;
  }


  return CO2Credits.toPrecision(2);
}
// { type: "Constructie: Hout", carbon: 6955 }, //kg/m3 based on average of co2 content from oncra quickscan materials
// { type: "Constructie: CLT or LVL", carbon: 647 }, //kg/m3 based on average of co2 content from oncra quickscan materials

// { type: "Constructie: Spaanplaat", carbon: 1051 }, //kg/m3 based on average of co2 content from oncra quickscan materials
// { type: "Isolatie: houtvezels", carbon: 198 }, //kg/m3 based on average of co2 content from oncra quickscan materials
// { type: "Isolatie: stro", carbon: 175 }, //kg/m3 bioblow stro
// { type: "Isolatie: hemp or flax", carbon: 34 }, //13,79 kg/m2! gemiddelde van quickscan materialen
// { type: "Composiet: wood-based", carbon: 1689 }, // kg/m3
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



