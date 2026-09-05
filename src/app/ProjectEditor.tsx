import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Container, Divider, Paper, Typography } from "@mui/material";
import { AutoFields, AutoForm, ErrorsField } from "uniforms-mui";
import { steps } from "../config/steps";
import type { FormModel } from "../forms/types";
import { Sidebar } from "../components/layout/SideBar";
import { Intro } from "../features/intro/Intro";
import { IntroHow } from "../features/intro/Intro-how";
import { PrescanQuestions2 } from "../features/prescan2";
import { QuickScanFields } from "../features/quick-scan";
import { Review } from "../features/review";
import { makeStepBridge } from "../forms/makeStepBridge";
import { ProjectplanFields } from "../features/validation";
import { useSyncQuickScanFromPreScanElements } from "../features/quick-scan/useSyncQuickScanFromPrescan";
import { BewijsDocuments } from "../features/validation/BewijsDocuments";
import { Resultaatvalidatie } from "../features/validation/Resultaatvalidatie";
import { api, ApiError } from "../api/client";

const defaultModel: FormModel = {
  quickScan: [
    {
      element: "",
      productType: "",
      fabrikant: "",
      productCategory: "",
      aantal: 1,
      eenheid: "",
    },
  ],
  projectplanTitel: "",
  projectplanBeschrijving: "",
  projectplanNaam: "",
  projectplanEmail: "",
  projectplanVloeroppervlak: undefined,
  projectplanProjectnummer: "",
  projectplanBouwfase: undefined,
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function ProjectEditor(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const formRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [projectName, setProjectName] = useState("");

  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeSub, setActiveSub] = useState<number>(0);
  const [model, setModel] = useState<FormModel>(defaultModel);

  const quickScanInitialized = useRef(false);
  useSyncQuickScanFromPreScanElements(model.structuralElements, setModel, quickScanInitialized);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    (async () => {
      try {
        const project = await api.getProject(projectId);
        if (cancelled) return;
        setModel({ ...defaultModel, ...project.formData });
        setActiveStep(project.activeStep);
        setActiveSub(project.activeSub);
        setProjectName(project.name);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Project laden mislukt");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const saveProject = useCallback(
    async (nextStep: number, nextSub: number, nextModel: FormModel) => {
      if (!projectId) return;
      setSaveState("saving");
      try {
        const saved = await api.saveProject(projectId, {
          formData: nextModel,
          activeStep: nextStep,
          activeSub: nextSub,
        });
        setProjectName(saved.name);
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    },
    [projectId]
  );

  const currentStep = steps[activeStep];
  const currentSub = currentStep.substeps[activeSub];

  const stepBridge = useMemo(() => makeStepBridge(currentSub), [currentSub]);

  const jumpTo = (s: number, sub: number) => {
    setActiveStep(s);
    setActiveSub(sub);
    saveProject(s, sub, model);
  };

  const goNext = () => {
    const atLastSub = activeSub >= currentStep.substeps.length - 1;
    let nextStep = activeStep;
    let nextSub = activeSub;
    if (!atLastSub) {
      nextSub = activeSub + 1;
    } else if (activeStep < steps.length - 1) {
      nextStep = activeStep + 1;
      nextSub = 0;
    }
    setActiveStep(nextStep);
    setActiveSub(nextSub);
    saveProject(nextStep, nextSub, model);
  };

  const goBack = () => {
    const atFirstSub = activeSub === 0;
    let nextStep = activeStep;
    let nextSub = activeSub;
    if (!atFirstSub) {
      nextSub = activeSub - 1;
    } else if (activeStep > 0) {
      const prevStep = steps[activeStep - 1];
      nextStep = activeStep - 1;
      nextSub = prevStep.substeps.length - 1;
    }
    setActiveStep(nextStep);
    setActiveSub(nextSub);
    saveProject(nextStep, nextSub, model);
  };

  const handleSubmit = () => {
    goNext();
  };

  const handleManualSave = () => {
    saveProject(activeStep, activeSub, model);
  };

  const isFinalOverview = currentStep.key === "publiceer" && currentSub.key === "overzicht";

  if (loading) {
    return (
      <Container sx={{ py: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Terug naar overzicht
        </Button>
      </Container>
    );
  }

  const ContentFields =
    currentSub.render === "intro-waarom" ? (
      <Intro />
    ) : currentSub.render === "intro-hoe" ? (
      <IntroHow />
    ) : currentSub.render === "prescanQuestions2" ? (
      <PrescanQuestions2 model={model} />
    ) : currentSub.render === "quickProducts" ? (
      <QuickScanFields />
    ) : currentSub.render === "projectplanFields" ? (
      <ProjectplanFields model={model} />
    ) : currentSub.render === "bewijsDocuments" ? (
      <BewijsDocuments />
    ) : currentSub.render === "resultaatValidatie" ? (
      <Resultaatvalidatie />
    ) : isFinalOverview ? (
      <Review model={model} />
    ) : (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <AutoFields fields={currentSub.fields} />
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">{projectName || "Project"}</Typography>
        <Button variant="text" onClick={() => navigate("/")}>
          Naar overzicht
        </Button>
      </Box>
      <Paper elevation={2} sx={{ p: 0, overflow: "hidden", borderRadius: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "360px 1fr" } }}>
          <Sidebar activeStep={activeStep} activeSub={activeSub} jumpTo={jumpTo} />

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              {currentStep.label} — {currentSub.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {currentSub.description}
            </Typography>

            <AutoForm
              ref={formRef}
              schema={stepBridge}
              model={model}
              onChangeModel={setModel}
              onSubmit={handleSubmit}
              noValidate={false}
            >
              {ContentFields}

              <ErrorsField />
              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0 && activeSub === 0}
                  onClick={goBack}
                  sx={{ bgcolor: "#fff" }}
                >
                  Terug
                </Button>

                <Typography variant="caption" color="text.secondary">
                  {saveState === "saving" && "Opslaan..."}
                  {saveState === "saved" && "Opgeslagen"}
                  {saveState === "error" && "Opslaan mislukt"}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="outlined" onClick={handleManualSave} sx={{ bgcolor: "#fff" }}>
                    Opslaan
                  </Button>
                  <Button variant="contained" onClick={() => formRef.current?.submit()}>
                    Volgende
                  </Button>
                </Box>
              </Box>
            </AutoForm>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
