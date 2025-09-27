import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, LinearProgress } from "@mui/material";
import { steps } from "../../config/steps";
import { DoneCircle } from "./icons/DoneCircle";
import { PendingCircle } from "./icons/PendingCircle";
import { textColour } from "../../app/theme";

export function Sidebar({
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
