import { houtGeenEpd } from "./houtGeenEpd";

export type ProductEntry = {
  manufacturer: string;
  product: string;
  carbon: number; // kg CO2e per declared unit (as a number; negatives mean storage)
  unit: string;   // measurement unit, e.g. m3, m2, kg, m
};

// NOTE: I converted the European decimal commas to dots so these are real numbers.
export const ENTRIES: ProductEntry[] = [
  { manufacturer: "Stora Enso", product: "CLT (Cross Laminated Timber)", carbon: -762.0, unit: "m3" },
  { manufacturer: "EcoCocon s.r.o.", product: "Standard and Braced Straw Panels", carbon: -123.0, unit: "m2" },
  { manufacturer: "Stora Enso", product: "ThermoWood®", carbon: -744.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "KVH® structural timber", carbon: -717.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "LVL (Laminated Veneer Lumber)", carbon: -766.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "Classic Planed", carbon: -753.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "Classic Sawn", carbon: -733.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "Industrial components", carbon: -833.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "Cladding and Decking", carbon: -728.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "SylvaTM CLT Rib", carbon: -124.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "SylvaTM LVL Rib", carbon: -103.0, unit: "m3" },
  { manufacturer: "Stora Enso", product: "Multiple glued LVL G", carbon: -804.0, unit: "m3" },
  { manufacturer: "Ekolution AB", product: "Ekolution® Hemp Fibre Insulation", carbon: -7.88, unit: "m2" },
  { manufacturer: "Ekovilla Oy", product: "Loose Fill Cellulose Insulation", carbon: -1.36, unit: "kg" },
  { manufacturer: "KLH Massivholz GmbH", product: "KLH® - CLT (Cross Laminated Timber)", carbon: -762.0, unit: "m3" },
  { manufacturer: "Grigeo Baltwood UAB", product: "Painted and non-painted Hard Fiberboard", carbon: -1600.0, unit: "m3" },
  { manufacturer: "Metsä Wood", product: "Metsä Wood Birch plywood", carbon: -618.0, unit: "m3" },
  { manufacturer: "Metsä Wood", product: "Metsä Wood Finnjoist® I-beam", carbon: -1.63, unit: "kg" },
  { manufacturer: "Ekovilla Oy", product: "Slab cellulose thermal insulation", carbon: -1.91, unit: "m2" },
  { manufacturer: "LK Systems AB", product: "LK HeatFloor Board", carbon: -1.12, unit: "kg" },
  { manufacturer: "Byggelit AB", product: "Particle board P3, P5 and P7", carbon: -934.0, unit: "m3" },
  { manufacturer: "SIA Amber Wood", product: "Oak multilayer floor boards", carbon: -2270.0, unit: "m3" },
  { manufacturer: "SIA Amber Wood", product: "Two layer floor boards", carbon: -2070.0, unit: "m3" },
  { manufacturer: "SIA Amber Wood", product: "Oak solid floor boards", carbon: -1730.0, unit: "m3" },
  { manufacturer: "Latvia Timber International SIA", product: "Planed and painted softwood", carbon: -750.0, unit: "m3" },
  { manufacturer: "UAB VMG Lignum constructions", product: "Load-bearing construction particle boards", carbon: -1100.0, unit: "m3" },
  { manufacturer: "Nerkoon Höyläämö Oy", product: "Exterior Claddings", carbon: -708.0, unit: "m3" },
  { manufacturer: "GRUPO GARNICA PLYWOOD, S.A.U.", product: "Plywood Panels : LAUDIO FORM, LAUDIO WIRE", carbon: -3130.0, unit: "m3" },
  { manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 6/5", carbon: -1520.0, unit: "m3" },
  { manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 12/7", carbon: -1460.0, unit: "m3" },
  { manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 15/7", carbon: -1440.0, unit: "m3" },
  { manufacturer: "E. Vigolungo SpA", product: "VigoPlyL 18/9", carbon: -1460.0, unit: "m3" },
  { manufacturer: "GRUPO GARNICA PLYWOOD", product: "Plywood Panels: LAUDIO PINE, LAUDIO DECO, LAUDIO LVL", carbon: -2200.0, unit: "m3" },
  { manufacturer: "OrganoWood AB", product: "Silicium HT for flooring", carbon: -773.0, unit: "m3" },
  { manufacturer: "OrganoWood AB", product: "Silicium HT for cladding", carbon: -773.0, unit: "m3" },
  { manufacturer: "Combiwood OÜ", product: "Natural pine mouldings", carbon: -0.9, unit: "m" },
  { manufacturer: "Combiwood OÜ", product: "Painted pine mouldings", carbon: -0.9, unit: "m" },
  { manufacturer: "Vudlande SIA", product: "Planed sawn timber", carbon: -724.0, unit: "m3" },
  { manufacturer: "LEKO LABS", product: "LEKO LABS Wall System", carbon: -1.52, unit: "kg" },
  { manufacturer: "UPM Timber", product: "Standard and special sawn timber", carbon: -786.0, unit: "m3" },
  { manufacturer: "Tarkett France", product: "Wood Flooring - Swedish Production, 13 - 14 mm thick", carbon: -7.49, unit: "m2" },
  { manufacturer: "Tarkett France", product: "Wood Flooring - Swedish Production, 14 mm thick with Walnut and Maple wood", carbon: -3.92, unit: "m2" },
  { manufacturer: "Tarkett France", product: "Wood Flooring - Swedish Production, 22 mm thick", carbon: -12.7, unit: "m2" },
  { manufacturer: "Degmeda UAB", product: "Fire tempered cladding and decking", carbon: -707.0, unit: "m3" },
  { manufacturer: "Studiengemeinschaft Holzleimbau e.V.", product: "Cross-laminated timber (X-LAM)", carbon: -753.0, unit: "m3" },
  { manufacturer: "Studiengemeinschaft Holzleimbau e.V.", product: "Glued laminated timber (Glulam)", carbon: -773.0, unit: "m3" },
  { manufacturer: "Derix", product: "X-LAM (Cross laminated timber) | with retour system", carbon: -768.0, unit: "m3" },
  { manufacturer: "Svenskt Trä", product: "Swedish sawn dried timber of spruce or pine", carbon: -876.0, unit: "m3" },
  { manufacturer: "SWISS KRONO Group", product: "OSB", carbon: -890.0, unit: "m3" },
  { manufacturer: "GUTEX Holzfaserplattenwerk H. Henselmann GmbH + Co KG", product: "Wood fibre insulation boards", carbon: -198.4, unit: "m3" },
  { manufacturer: "HASSLACHER Holding GmbH", product: "Glued laminated timber, glued solid timber, block glued glulam, special components", carbon: -753.0, unit: "m3" },
  { manufacturer: "Russwood Ltd", product: "Thermopine® cladding", carbon: -742.0, unit: "m3" },
  { manufacturer: "HASSLACHER Holding GmbH", product: "Structural finger jointed solid timber & GLT® – Girder Longitudinally Tensiletested", carbon: -753.0, unit: "m3" },
  { manufacturer: "Russwood Ltd", product: "Thermopine® profiled cladding coated with Teknos", carbon: -742.0, unit: "m3" },
  { manufacturer: "ZinCo GmbH", product: "Green Roof System", carbon: -5.32, unit: "m3" },
  { manufacturer: "Forbo Flooring B.V.", product: "Marmoleum 2.0 and 2.5 mm", carbon: -4.17, unit: "m3" },
  { manufacturer: "James Hardie Europe GmbH", product: "fermacell® gypsum fibre board", carbon: -3.58, unit: "m3" },
  { manufacturer: "Gramitherm", product: "Gramitherm 100", carbon: -7.03, unit: "m3" },
  { manufacturer: "Aveco de Bondt", product: "HSB frame voor dragende en nietdragende binnenwand", carbon: -9.07, unit: "m2" },
  { manufacturer: "Aveco de Bondt", product: "HSB frame voor vloerelement", carbon: -15.46, unit: "m2" },
  { manufacturer: "Platowood", product: "Gevelpaneel vuren", carbon: -24.7, unit: "m2" },
  { manufacturer: "Platowood", product: "Gevelpaneel populier", carbon: -29.7, unit: "m2" },
  { manufacturer: "Platowood", product: "Gevelpaneel fraké", carbon: -31.8, unit: "m2" },
  { manufacturer: "FAAY", product: "Kingsize prefab inner wall (flax + gypsum)", carbon: 19.69, unit: "m2" },
  ...houtGeenEpd
];

export type ProductGroup = {
  type: string;
  carbon: number;  
}

export const PRODUCTS : ProductGroup[] = [
  {type: "Structural: Hout", carbon: 618},
  {type: "Structural: CLT or LVL",carbon: 12},
  {type: "Structural: Bamboo", carbon: 14},
  {type: "Fibers: houtvezels", carbon: 198},
  {type: "Fibers: stro", carbon:775},
  {type: "Fibers: hemp or flax", carbon:34},
  {type: "Composite: wood-based", carbon:34},
  {type: "Composite: mycelium-based", carbon:34},
  {type: "Composite: conrete based", carbon:34},
] 


export const getCarbonByType = (type: string): number | undefined => {
  const item = PRODUCTS.find((p) => p.type === type);
  return item?.carbon;
};

// Distinct manufacturers (sorted).
export const manufacturers = Array.from(new Set(ENTRIES.map(e => e.manufacturer))).sort();

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

