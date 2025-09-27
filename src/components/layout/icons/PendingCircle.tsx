import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { textColour } from "../../../app/theme";

export function PendingCircle({ active }: { active?: boolean }) {
  return <RadioButtonUncheckedIcon fontSize="small" sx={{ color: active ? textColour : undefined }} />;
}
