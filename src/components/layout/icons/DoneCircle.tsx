import { Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { primaryColor } from "../../../app/theme";

export function DoneCircle() {
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
