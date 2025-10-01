import React, { useRef, useState, useMemo } from "react";
import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AutoFields, AutoForm, ErrorsField } from "uniforms-mui";

import theme from "./theme";
import { bridge } from "../forms/bridge";
import { steps } from "../config/steps";
import type { FormModel } from "../forms/types";
import { Sidebar } from "../components/layout/SideBar";
import { PrescanQuestions } from "../features/prescan";
import { QuickScanFields } from "../features/quick-scan";
import { Review } from "../features/review";
import { productsByManufacturer } from "../data/productCatalog";
import { makeStepBridge } from "../forms/makeStepBridge";


export default function App(): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeSub, setActiveSub] = useState<number>(0);
  const formRef = useRef<any>(null);

  // Initial model (same as before)
  const initialMfr = "Ekolution AB";
  const initialProduct = productsByManufacturer[initialMfr][0];
  const [model, setModel] = useState<FormModel>({
    quickScan: [{ fabrikant: initialMfr, productCategory: initialProduct, aantal: 1, eenheid: "m²" }],
  });

  const currentStep = steps[activeStep];
  const currentSub = currentStep.substeps[activeSub];

  // Dynamic, per-substep Uniforms bridge: validates ONLY current substep
  const stepBridge = useMemo(() => makeStepBridge(currentSub), [currentSub]);

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

  // Optional: keep this if you still want to show a custom alert; otherwise you can just call goNext()
  const handleSubmit = () => {
    // With the dynamic bridge, Uniforms already validates only the current substep.
    // If the form is valid, onSubmit is called and we advance.
    goNext();
  };

  const isFinalOverview = currentStep.key === "publiceer" && currentSub.key === "overzicht";

  const ContentFields =
    currentSub.render === "prescanQuestions" ? (
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
                {currentStep.label} — {currentSub.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {currentSub.description}
              </Typography>

              <AutoForm
                ref={formRef}
                schema={stepBridge}          // ⟵ validate only current substep
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
                    sx={{ bgcolor: "#fff" }}
                  >
                    Terug
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => formRef.current?.submit()}
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
