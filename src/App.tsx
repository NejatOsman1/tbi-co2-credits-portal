import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  AutoForm,
  AutoFields,
  ErrorsField,
  SelectField,
  NumField,
  TextField,
  ListField,
  NestField,
  ListItemField,
  // ListAddField,
  ListDelField,
} from "uniforms-mui";
import { createTheme, ThemeProvider } from "@mui/material";
import { ZodBridge } from "uniforms-bridge-zod";
import { z } from "zod";
import { useForm, useField } from "uniforms";
import {
  manufacturers,
  productsByManufacturer,
  carbonByPair,
} from "./data/productCatalog";
import { calcTotalTonCO2e, formatTonCO2e } from "./calculateCO2"

/***********************
 * THEME COLORS
 ***********************/
const primaryColor = "#a816d9";
const primaryHover = "#8a11b5";
const textColour = "#630d80";

const theme = createTheme({
  typography: {
    h5: { color: textColour },
    h6: { color: textColour },
  },
});

/***********************
 * TYPES & SCHEMAS
 ***********************/
const bouwFasen = ["Ontwerp", "Aanbesteding", "Bouw", "Afgerond"] as const;
const jaNeeMaybe = ["Ja", "Nee", "Weet ik nog niet"] as const;
const aantalm2 = ["Minder dan 100 m2", "Meer dan 100 m2"] as const;

// Helper to validate the pair against the catalog
const isValidPair = (m?: string, p?: string) =>
  !!m && !!p && Array.isArray(productsByManufacturer[m]) && productsByManufacturer[m].includes(p as string);

/** Full model covers all substeps */
// Define a plain row schema (no refine here)
const quickScanRow = z.object({
  fabrikant: z.string().min(1, "Kies een fabrikant"),
  productCategory: z.string().min(1, "Kies een product"),
  aantal: z.number().positive({ message: "Voer een positief getal in" }),
  eenheid: z.string().min(1, "Verplicht veld"),
});

// Use the plain row in FullSchema
export const FullSchema = z.object({
  prescanFase: z.enum(bouwFasen).optional(),
  prescanBio: z.enum(jaNeeMaybe).optional(),
  aantalm2: z.enum(aantalm2).optional(),

  quickScan: z.array(quickScanRow).optional(),  // <-- no refine here

  oncraScore: z.number().optional(),
  oncraOpmerking: z.string().optional(),
  projectplanTitel: z.string().optional(),
  projectplanBeschrijving: z.string().optional(),
  bewijsLinks: z.array(z.string().url("Voer een geldige URL in")).optional(),
  validatieGoedgekeurd: z.boolean().optional(),
  validatieToelichting: z.string().optional(),
  fotoUrls: z.array(z.string().url("Voer een geldige URL in")).optional(),
  verkoopKanaal: z.enum(["Marketplace", "Direct", "Veiling"] as const).optional(),
  koperNaam: z.string().optional(),
  verkoopBedrag: z.number().optional(),
});

// Step-level validation: check pairs with superRefine on the *array*
const requireAtLeastOneQuickItem = z.object({
  quickScan: z.array(quickScanRow).min(1, "Voeg minimaal één item toe"),
}).superRefine((data, ctx) => {
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

export type FormModel = z.infer<typeof FullSchema>;

/** Validation per substep */


const prescanSchema = z.object({
  prescanFase: z.enum(bouwFasen, { required_error: "Kies een fase" }),
  prescanBio: z.enum(jaNeeMaybe, { required_error: "Kies een optie" }),
  aantalm2: z.enum(aantalm2, { required_error: "Kies een optie" }),
});

const oncraResultSchema = z.object({
  oncraScore: z.number({ invalid_type_error: "Voer een score in" }).min(0, "≥ 0").optional(),
  oncraOpmerking: z.string().optional(),
});

const projectplanSchema = z.object({
  projectplanTitel: z.string().min(1, "Titel is verplicht"),
  projectplanBeschrijving: z.string().min(1, "Beschrijving is verplicht"),
});

const bewijsSchema = z.object({
  bewijsLinks: z.array(z.string().url("Ongeldige URL")).min(1, "Voeg minstens één link toe"),
});

const validatieResultSchema = z.object({
  validatieGoedgekeurd: z.literal(true, {
    errorMap: () => ({ message: "Bevestig goedkeuring om verder te gaan (dummy)" }),
  }),
  validatieToelichting: z.string().optional(),
});

const publiceerFotoSchema = z.object({
  fotoUrls: z.array(z.string().url("Ongeldige URL")).min(1, "Voeg minstens één foto-URL toe"),
});

const verkoopKanalenSchema = z.object({
  verkoopKanaal: z.enum(["Marketplace", "Direct", "Veiling"], {
    required_error: "Kies een verkoopkanaal",
  }),
});

const onderhandSchema = z.object({
  koperNaam: z.string().min(1, "Kopernaam is verplicht"),
  verkoopBedrag: z.number({ invalid_type_error: "Voer bedrag in" }).positive("Moet > 0 zijn"),
});

/** Bridge for Uniforms */
const bridge = new ZodBridge({ schema: FullSchema });

/***********************
 * REVIEW
 ***********************/
function Review({ model }: { model: FormModel }) {
  const entries = Object.entries(model || {});
  if (!entries.length) return <Typography color="text.secondary">Geen gegevens om te tonen.</Typography>;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
      {entries.map(([k, v]) => (
        <Box
          key={k}
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {k}
          </Typography>
          <Typography variant="body1">
            {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/***********************
 * Dependent Select helpers (Uniforms)
 ***********************/
// Fabrikant (manufacturer) — always provide options
// Fabrikant: simple select, no custom onChange needed
function FabrikantField() {
  const mfrOptions = (manufacturers ?? []).map(v => ({ label: v, value: v }));
  return (
    <SelectField
      name="fabrikant"
      label="Fabrikant"
      fullWidth
      options={mfrOptions}
    />
  );
}

// Product: options depend on current row's fabrikant
function ProductCategoryField() {
  // In v4 you MUST pass the 2nd arg; no generic here
  const [{ value: selectedMfr }] = useField("fabrikant", { initialValue: false });
  const products = selectedMfr ? (productsByManufacturer[selectedMfr] ?? []) : [];
  const prodOptions = products.map(v => ({ label: v, value: v }));

  return (
    <SelectField
      name="productCategory"
      label="Product"
      fullWidth
      options={prodOptions}
      disabled={!selectedMfr}
      placeholder={selectedMfr ? "Kies product" : "Eerst fabrikant kiezen"}
    />
  );
}

/**
 * Keeps the row consistent:
 * - When fabrikant changes, clear productCategory if it's not valid for that fabrikant
 */
function RowScopeEffects() {
  const form = useForm();
  const [{ value: fabrikant }] = useField("fabrikant", { initialValue: false });
  const [{ value: product }]   = useField("productCategory", { initialValue: false });

  React.useEffect(() => {
    const allowed = fabrikant ? (productsByManufacturer[fabrikant] ?? []) : [];
    if (!fabrikant && product !== undefined) {
      form.onChange("productCategory", undefined);
      return;
    }
    if (product && !allowed.includes(product)) {
      form.onChange("productCategory", undefined);
    }
  }, [fabrikant, product, form]);

  return null;
}

function QuickScanFields() {
  const [{ value: rows = [] }] = useField("quickScan", { initialValue: false });

  const totalTon = calcTotalTonCO2e(rows);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Op basis van het gebruik van de bio based materialen krijgt u snel inzicht in het aantal CO2 credits die u kunt genereren voor uw project.
      </Typography>

      <ListField name="quickScan">
        <NestField name="$">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr 1fr auto" }, // <-- space for the "-" button
              gap: 2,
              alignItems: "center",
            }}
          >
            <FabrikantField />
            <ProductCategoryField />
            <NumField name="aantal" label="Aantal" decimal={false} fullWidth />
            <TextField name="eenheid" label="Eenheid" placeholder="st., m², kWp..." fullWidth />

            {/* Delete row button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <ListDelField name="" />
            </Box>
          </Box>
        </NestField>

      </ListField>

      {/* ---- TOTAL ---- */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.100",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Totaal t CO₂e
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "success.main" }}
        >
          {formatTonCO2e(totalTon)}
        </Typography>
      </Box>
    </Box>
  );
}



/***********************
 * Small helpers for sidebar icons
 ***********************/
function DoneCircle() {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        bgcolor: primaryColor,
        display: "grid",
        placeItems: "center",
      }}
    >
      <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
    </Box>
  );
}
function PendingCircle({ active }: { active?: boolean }) {
  return <RadioButtonUncheckedIcon fontSize="small" sx={{ color: active ? textColour : undefined }} />;
}

/***********************
 * STEP CONFIG
 ***********************/
type FieldKey = keyof FormModel;
type SubstepDef = {
  key: string;
  label: string;
  fields: FieldKey[];
  zod?: z.ZodTypeAny | null;
  render?: "quickProducts" | "prescanQuestions";
};
type StepDef = {
  key: string;
  label: string;
  substeps: SubstepDef[];
};

const steps: StepDef[] = [
  {
    key: "prescan",
    label: "Prescan",
    substeps: [
      {
        key: "prescan-main",
        label: "Prescan",
        fields: ["prescanFase", "prescanBio", "aantalm2"],
        zod: prescanSchema,
        render: "prescanQuestions",
      },
    ],
  },
  {
    key: "quick",
    label: "Quick scan",
    substeps: [
      {
        key: "product-materialen",
        label: "Product en Materialen",
        fields: ["quickScan"],
        zod: requireAtLeastOneQuickItem,
        render: "quickProducts",
      },
      {
        key: "oncra-result",
        label: "Oncra scan resultaat",
        fields: ["oncraScore", "oncraOpmerking"],
        zod: oncraResultSchema,
      },
    ],
  },
  {
    key: "validatie",
    label: "Project validatie",
    substeps: [
      {
        key: "projectplan",
        label: "Projectplan template invullen",
        fields: ["projectplanTitel", "projectplanBeschrijving"],
        zod: projectplanSchema,
      },
      {
        key: "bewijsstukken",
        label: "Upload bewijsstukken",
        fields: ["bewijsLinks"],
        zod: bewijsSchema,
      },
      {
        key: "validatie-result",
        label: "Resultaat validatie Oncra",
        fields: ["validatieGoedgekeurd", "validatieToelichting"],
        zod: validatieResultSchema,
      },
    ],
  },
  {
    key: "publiceer",
    label: "Publiceer project",
    substeps: [
      { key: "foto", label: "Upload projectfoto's", fields: ["fotoUrls"], zod: publiceerFotoSchema },
      { key: "kanalen", label: "Selecteer verkoopkanalen", fields: ["verkoopKanaal"], zod: verkoopKanalenSchema },
      { key: "onderhands", label: "Onderhands verkoop registreren", fields: ["koperNaam", "verkoopBedrag"], zod: onderhandSchema },
      { key: "overzicht", label: "Overzicht", fields: [], zod: null },
    ],
  },
];

/***********************
 * Sidebar + progress
 ***********************/
function Sidebar({
  activeStep,
  activeSub,
  jumpTo,
}: {
  activeStep: number;
  activeSub: number;
  jumpTo: (targetStep: number, targetSub: number) => void;
}) {
  const flattened: { stepIndex: number; subIndex: number; label: string }[] = [];
  steps.forEach((s, si) =>
    s.substeps.forEach((sub, sj) => flattened.push({ stepIndex: si, subIndex: sj, label: `${s.label} — ${sub.label}` }))
  );

  const currentFlatIndex = steps.slice(0, activeStep).reduce((sum, s) => sum + s.substeps.length, 0) + activeSub;

  const totalUnits = flattened.length;
  const percent = Math.round((currentFlatIndex / (totalUnits - 1)) * 100);

  const isDone = (idx: number) => idx < currentFlatIndex;
  const isActive = (idx: number) => idx === currentFlatIndex;

  return (
    <Box sx={{ p: 3, borderRight: { md: "1px solid" }, borderColor: { md: "divider" } }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        TBI CO2 credits portal
      </Typography>

      <List dense>
        {steps.map((step, si) => {
          const stepStartIndex = steps.slice(0, si).reduce((sum, s) => sum + s.substeps.length, 0);
          const stepEndIndex = stepStartIndex + step.substeps.length - 1;
          const stepDone = currentFlatIndex > stepEndIndex;
          const stepActive = currentFlatIndex >= stepStartIndex && currentFlatIndex <= stepEndIndex;

          return (
            <Box key={step.key} sx={{ mb: 0.5 }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {stepDone ? <DoneCircle /> : <PendingCircle active={stepActive} />}
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary={step.label} />
              </ListItem>

              {step.substeps.map((sub, sj) => {
                const flatIdx = stepStartIndex + sj;
                const clickable = flatIdx <= currentFlatIndex;
                return (
                  <ListItem
                    key={sub.key}
                    disableGutters
                    onClick={() => clickable && jumpTo(si, sj)}
                    sx={{
                      pl: 4.5,
                      cursor: clickable ? "pointer" : "default",
                      opacity: clickable ? 1 : 0.7,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      {isDone(flatIdx) ? <DoneCircle /> : <PendingCircle active={isActive(flatIdx)} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={sub.label}
                      primaryTypographyProps={{
                        fontWeight: isActive(flatIdx) ? 600 : undefined,
                        color: isActive(flatIdx) ? textColour : undefined,
                      }}
                    />
                  </ListItem>
                );
              })}
            </Box>
          );
        })}
      </List>

      <Typography variant="caption" color="text.secondary">
        Voortgang
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          mt: 1,
          borderRadius: 1,
          "& .MuiLinearProgress-bar": { backgroundColor: textColour },
        }}
      />
    </Box>
  );
}

/***********************
 * APP
 ***********************/
export default function App(): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeSub, setActiveSub] = useState<number>(0);

  const initialMfr = "Ekolution AB";
  const initialProduct = productsByManufacturer[initialMfr][0];

  const [model, setModel] = useState<FormModel>({
    quickScan: [{ fabrikant: initialMfr, productCategory: initialProduct, aantal: 1, eenheid: "m²" }],
  });

  const formRef = useRef<any>(null);

  const currentStep = steps[activeStep];
  const currentSub = currentStep.substeps[activeSub];

  const jumpTo = (s: number, sub: number) => {
    setActiveStep(s);
    setActiveSub(sub);
  };

  const goNext = () => {
    const atLastSub = activeSub >= currentStep.substeps.length - 1;
    if (!atLastSub) {
      setActiveSub((v) => v + 1);
    } else if (activeStep < steps.length - 1) {
      setActiveStep((v) => v + 1);
      setActiveSub(0);
    }
  };

  const goBack = () => {
    const atFirstSub = activeSub === 0;
    if (!atFirstSub) {
      setActiveSub((v) => v - 1);
      return;
    }
    if (activeStep > 0) {
      const prevStep = steps[activeStep - 1];
      setActiveStep((v) => v - 1);
      setActiveSub(prevStep.substeps.length - 1);
    }
  };

  /** Validate only fields visible in current substep */
  const canGoNext = (): boolean => {
    if (!currentSub.zod) return true;
    const slice = currentSub.fields.reduce<Partial<FormModel>>(
      (acc, key) => ({ ...acc, [key]: (model as any)[key] }),
      {}
    );
    const res = currentSub.zod.safeParse(slice);
    if (!res.success) {
      const msg = res.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
      alert(msg);
      return false;
    }
    return true;
  };

  /** Title + description per substep */
  const title = `${currentStep.label} — ${currentSub.label}`;
  const description = (() => {
    switch (currentSub.key) {
      case "prescan-main":
        return "Beantwoord de prescan-vragen zodat we uw project beter kunnen inschatten.";
      case "product-materialen":
        return "Voeg je producten en materialen toe voor de quick scan.";
      case "oncra-result":
        return "Vul (dummy) Oncra scan resultaten in.";
      case "projectplan":
        return "Vul het projectplan (dummy) in.";
      case "bewijsstukken":
        return "Voeg bewijslinks toe (dummy).";
      case "validatie-result":
        return "Markeer validatie resultaat (dummy).";
      case "foto":
        return "Voeg foto-URL's toe (dummy).";
      case "kanalen":
        return "Kies je verkoopkanaal (dummy).";
      case "onderhands":
        return "Registreer onderhandse verkoop (dummy).";
      case "overzicht":
        return "Controleer het overzicht (dummy).";
      default:
        return "Vul de gevraagde velden in.";
    }
  })();

  const handleSubmit = () => {
    if (!canGoNext()) return;
    goNext();
  };

  const isFinalOverview = currentStep.key === "publiceer" && currentSub.key === "overzicht";

  const PrescanQuestions = ({ model }: { model: FormModel }) => (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 300 }}>
        (Vragen nader te specificeren)
      </Typography>
      <Box>
        <SelectField name="prescanFase" label="In welke fase van het bouwproces bent u?" allowedValues={bouwFasen as unknown as string[]} fullWidth />
      </Box>
      <Box>
        <SelectField name="prescanBio" label="Overweegt u om bio-based materialen toe te passen in uw project?" allowedValues={jaNeeMaybe as unknown as string[]} fullWidth />
      </Box>
      <Box>
        <SelectField name="aantalm2" label="Wat is de omvang van het project in vloeroppervlak (m²)?" allowedValues={aantalm2 as unknown as string[]} fullWidth />
      </Box>

      {(model?.prescanBio === "Ja" || model?.prescanBio === "Weet ik nog niet") && model?.aantalm2 === "Meer dan 100 m2" ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
            U komt in aanmerking voor CO2 credits! Klik op volgende om te berekenen hoeveel CO2 credits uw project kan opleveren.
          </Typography>
        </Box>
      ) : model?.prescanBio === "Nee" || model?.aantalm2 === "Minder dan 100 m2" ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "error.main" }}>
            Helaas dit project komt niet in aanmerking voor CO2 credits.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );

  /** Fields UI */
  const ContentFields =
    currentSub.key === "prescan-main" ? (
      <PrescanQuestions model={model} />
    ) : currentSub.render === "quickProducts" ? (
      <QuickScanFields />
    ) : isFinalOverview ? (
      <Review model={model} />
    ) : (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <AutoFields fields={currentSub.fields} />
      </Box>
    );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Paper elevation={2} sx={{ p: 0, overflow: "hidden", borderRadius: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "360px 1fr" } }}>
            {/* Sidebar */}
            <Sidebar activeStep={activeStep} activeSub={activeSub} jumpTo={jumpTo} />

            {/* Content */}
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {description}
              </Typography>

              <AutoForm
                ref={formRef}
                schema={bridge}
                model={model}
                onChangeModel={setModel}
                onSubmit={handleSubmit}
                noValidate={false}
              >
                {ContentFields}

                <ErrorsField />
                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Button
                    variant="outlined"
                    disabled={activeStep === 0 && activeSub === 0}
                    onClick={goBack}
                    sx={{
                      bgcolor: "#fff",
                      color: primaryColor,
                      borderColor: primaryColor,
                      "&:hover": { bgcolor: "#f7ebfb", borderColor: primaryColor },
                    }}
                  >
                    Terug
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => formRef.current?.submit()}
                    sx={{
                      bgcolor: primaryColor,
                      color: "#fff",
                      "&:hover": { bgcolor: primaryHover },
                    }}
                  >
                    Volgende
                  </Button>
                </Box>
              </AutoForm>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
