import { houtGeenEpd } from "./houtGeenEpd";

export type ProductEntry = {
  type: string;
  manufacturer: string;
  product: string;
  carbon: number; // kg CO2e per declared unit (as a number; negatives mean storage)
  unit: string;   // measurement unit, e.g. m3, m2, kg, m
};

// NOTE: I converted the European decimal commas to dots so these are real numbers. 762,766,124,103,804,762,753,773,768,753,753
export const ENTRIES: ProductEntry[] = [
  { type: "Composiet: wood-based", manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 12/7", carbon: -1460.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 15/7", carbon: -1440.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 18/9", carbon: -1460.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 6/5", carbon: -1520.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "GRUPO GARNICA PLYWOOD", product: "Multiplex panelen: LAUDIO PINE, LAUDIO DECO, LAUDIO LVL", carbon: -2200.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "GRUPO GARNICA PLYWOOD, S.A.U.", product: "Multiplex panelen: LAUDIO FORM, LAUDIO WIRE", carbon: -3130.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "LEKO LABS", product: "LEKO LABS Wandsysteem", carbon: -1.52, unit: "kg" },
  { type: "Composiet: wood-based", manufacturer: "Metsä Wood", product: "Metsä Wood Berken multiplex", carbon: -618.0, unit: "m3" },
  { type: "Composiet: wood-based", manufacturer: "Metsä Wood", product: "Metsä Wood Finnjoist® I-ligger", carbon: -1.63, unit: "kg" },

  { type: "Constructie: CLT or LVL", manufacturer: "Derix", product: "X-LAM (Kruislaaghout) | met retoursysteem", carbon: -768.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "HASSLACHER Holding GmbH", product: "Gelijmd gelamineerd hout, gelijmd massief hout, blok gelijmd glulam, speciale componenten", carbon: -753.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "HASSLACHER Holding GmbH", product: "Constructief vingerlas massief hout & GLT® – Ligger Longitudinaal Trekgetest", carbon: -753.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "KLH Massivholz GmbH", product: "KLH® - CLT (Kruislaaghout)", carbon: -762.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Stora Enso", product: "CLT (Kruislaaghout)", carbon: -762.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Stora Enso", product: "LVL (Gelamineerd fineerhout)", carbon: -766.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Stora Enso", product: "Meervoudig gelijmd LVL G", carbon: -804.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Stora Enso", product: "SylvaTM CLT Rib", carbon: -124.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Stora Enso", product: "SylvaTM LVL Rib", carbon: -103.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Studiengemeinschaft Holzleimbau e.V.", product: "Kruislaaghout (X-LAM)", carbon: -753.0, unit: "m3" },
  { type: "Constructie: CLT or LVL", manufacturer: "Studiengemeinschaft Holzleimbau e.V.", product: "Gelijmd gelamineerd hout (Glulam)", carbon: -773.0, unit: "m3" },

  { type: "Constructie: Hout", manufacturer: "Aveco de Bondt", product: "HSB frame voor dragende en nietdragende binnenwand", carbon: -9.07, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Aveco de Bondt", product: "HSB frame voor vloerelement", carbon: -15.46, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Combiwood OÜ", product: "Natuurlijke grenen profiellijsten", carbon: -0.9, unit: "m" },
  { type: "Constructie: Hout", manufacturer: "Combiwood OÜ", product: "Geschilderde grenen profiellijsten", carbon: -0.9, unit: "m" },
  { type: "Constructie: Hout", manufacturer: "Degmeda UAB", product: "Brandwerend gevelbekleding en vlonders", carbon: -707.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Latvia Timber International SIA", product: "Geschaafd en geschilderd naaldhout", carbon: -750.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Nerkoon Höyläämö Oy", product: "Buitengevelbekleding", carbon: -708.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "OrganoWood AB", product: "Silicium HT voor gevelbekleding", carbon: -773.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "OrganoWood AB", product: "Silicium HT voor vloeren", carbon: -773.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Platowood", product: "Gevelpaneel fraké", carbon: -31.8, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Platowood", product: "Gevelpaneel populier", carbon: -29.7, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Platowood", product: "Gevelpaneel vuren", carbon: -24.7, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Russwood Ltd", product: "Thermopine® gevelbekleding", carbon: -742.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Russwood Ltd", product: "Thermopine® profielgevelbekleding met Teknos coating", carbon: -742.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "SIA Amber Wood", product: "Eiken meerlaags vloerplanken", carbon: -2270.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "SIA Amber Wood", product: "Eiken massief vloerplanken", carbon: -1730.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "SIA Amber Wood", product: "Tweelaags vloerplanken", carbon: -2070.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Stora Enso", product: "Gevelbekleding en vlonders", carbon: -728.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Stora Enso", product: "Klassiek geschaafd", carbon: -753.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Stora Enso", product: "Klassiek gezaagd", carbon: -733.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Stora Enso", product: "Industriële componenten", carbon: -833.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Stora Enso", product: "KVH® constructiehout", carbon: -717.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Stora Enso", product: "ThermoWood®", carbon: -744.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Svenskt Trä", product: "Zweeds gezaagd gedroogd vuren of grenen hout", carbon: -876.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Tarkett France", product: "Houten vloer - Zweedse productie, 13 - 14 mm dik", carbon: -7.49, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Tarkett France", product: "Houten vloer - Zweedse productie, 14 mm dik met walnoot en esdoorn", carbon: -3.92, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "Tarkett France", product: "Houten vloer - Zweedse productie, 22 mm dik", carbon: -12.7, unit: "m2" },
  { type: "Constructie: Hout", manufacturer: "UPM Timber", product: "Standaard en speciaal gezaagd hout", carbon: -786.0, unit: "m3" },
  { type: "Constructie: Hout", manufacturer: "Vudlande SIA", product: "Geschaafd gezaagd hout", carbon: -724.0, unit: "m3" },

  { type: "Constructie: Spaanplaat", manufacturer: "Byggelit AB", product: "Spaanplaat P3, P5 en P7", carbon: -934.0, unit: "m3" },
  { type: "Constructie: Spaanplaat", manufacturer: "Grigeo Baltwood UAB", product: "Geschilderde en ongeschilderde harde vezelplaat", carbon: -1600.0, unit: "m3" },
  { type: "Constructie: Spaanplaat", manufacturer: "LK Systems AB", product: "LK Vloerverwarming plaat", carbon: -1.12, unit: "kg" },
  { type: "Constructie: Spaanplaat", manufacturer: "SWISS KRONO Group", product: "OSB", carbon: -890.0, unit: "m3" },
  { type: "Constructie: Spaanplaat", manufacturer: "UAB VMG Lignum constructions", product: "Dragende constructie spaanplaten", carbon: -1100.0, unit: "m3" },
  { type: "Constructie: Spaanplaat", manufacturer: "Unilin Sanipan spaanplaat", product: "Dragende constructie spaanplaten", carbon: -1100.0, unit: "m3" },


  { type: "Isolatie: gipsvezel", manufacturer: "James Hardie Europe GmbH", product: "fermacell® gipsvezelplaat", carbon: -3.58, unit: "m3" },

  { type: "Isolatie: hemp or flax", manufacturer: "Ekolution AB", product: "Ekolution® Hennepvezel isolatie", carbon: -7.88, unit: "m2" },
  { type: "Isolatie: hemp or flax", manufacturer: "FAAY", product: "Kingsize prefab binnenwand (vlas + gips)", carbon: 19.69, unit: "m2" },

  { type: "Overige", manufacturer: "ZinCo GmbH", product: "Groen dak systeem", carbon: -5.32, unit: "m3" },
  { type: "Overige", manufacturer: "Forbo Flooring B.V.", product: "Marmoleum 2.0 en 2.5 mm", carbon: -4.17, unit: "m3" },

  { type: "Isolatie: HSB met houtvezels", manufacturer: "Ekovilla Oy", product: "Losse cellulose-isolatie", carbon: -1.36, unit: "kg" },
  { type: "Isolatie: HSB met houtvezels", manufacturer: "Ekovilla Oy", product: "Plaat cellulose thermische isolatie", carbon: -1.91, unit: "m2" },
  { type: "Isolatie: HSB met houtvezels", manufacturer: "GUTEX Holzfaserplattenwerk H. Henselmann GmbH + Co KG", product: "Thermoflex houtvezel isolatie", carbon: -198.4, unit: "m3" },

  { type: "Isolatie: stro", manufacturer: "Bioblow", product: "Bioblow inblaasstro isolatie", carbon: -198.4, unit: "m3" },
  { type: "Isolatie: stro", manufacturer: "EcoCocon s.r.o.", product: "Standaard en verstevigde stro panelen", carbon: -123.0, unit: "m2" },
  { type: "Isolatie: stro", manufacturer: "Gramitherm", product: "Gramitherm 100", carbon: -7.03, unit: "m3" },


  ...houtGeenEpd
];


export type ProductGroup = {
  type: string;
  carbon: number;  
}

export const PRODUCTS : ProductGroup[] = [
  {type: "Constructie: Hout", carbon: 618 }, //kg/m3 based on average of co2 content from oncra quickscan materials
  {type: "Constructie: CLT or LVL",carbon: 775}, //kg/m3 based on average of co2 content from oncra quickscan materials
 
  {type: "Constructie: Spaanplaat", carbon: 1051 }, //kg/m3 based on average of co2 content from oncra quickscan materials
  {type: "Isolatie: HSB met houtvezels", carbon: 198 }, //kg/m3 based on average of co2 content from oncra quickscan materials
  {type: "Isolatie: stro", carbon:175}, //kg/m3 bioblow stro
  {type: "Isolatie: hemp or flax", carbon:34}, //13,79 kg/m2! gemiddelde van quickscan materialen
  {type: "Composiet: wood-based", carbon:1689}, // kg/m3
  {type: "Constructie: Bamboo", carbon: 14},
  {type: "Composiet: mycelium-based", carbon:34},
  {type: "Composiet: conrete based", carbon:34},
]


export const getCarbonByType = (type: string): number | undefined => {
  const item = PRODUCTS.find((p) => p.type === type);
  return item?.carbon;
};

// Distinct manufacturers (sorted).
export const manufacturers = Array.from(new Set(ENTRIES.map(e => e.manufacturer))).sort();

const manufacturersByTypeSet = ENTRIES.reduce((acc, e) => {
  if (!e.type) return acc;
  (acc[e.type] ??= new Set()).add(e.manufacturer);
  return acc;
}, {} as Record<string, Set<string>>);

// Step 2: export as arrays (UI-friendly)
export const manufacturersByType: Record<string, string[]> =
  Object.fromEntries(
    Object.entries(manufacturersByTypeSet).map(([type, set]) => [
      type,
      Array.from(set).sort(),
    ])
  );
// Map manufacturer -> product list (sorted).
export const productsByManufacturer: Record<string, string[]> = manufacturers.reduce((acc, m) => {
  acc[m] = ENTRIES.filter(e => e.manufacturer === m)
    .map(e => e.product)
    .sort();
  return acc;
}, {} as Record<string, string[]>);

// Quick lookup of carbon by pair (useful for calculations later).
export const carbonByPair: Record<string, Record<string, number>> = ENTRIES.reduce((acc, e) => {
  acc[e.manufacturer] ??= {};
  acc[e.manufacturer][e.product] = e.carbon;
  return acc;
}, {} as Record<string, Record<string, number>>);

export const unitByPair: Record<string, Record<string, string>> = ENTRIES.reduce((acc, e) => {
  acc[e.manufacturer] ??= {};
  acc[e.manufacturer][e.product] = e.unit;
  return acc;
}, {} as Record<string, Record<string, string>>);

