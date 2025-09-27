import { createTheme } from "@mui/material/styles";

const primaryColor = "#a816d9";
const primaryHover = "#8a11b5";
const textColour = "#630d80";

const theme = createTheme({
  palette: {
    primary: { main: primaryColor },
  },
  typography: {
    h5: { color: textColour },
    h6: { color: textColour },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: primaryColor,
          color: "#fff",
          "&:hover": { backgroundColor: primaryHover },
        },
        outlined: {
          color: primaryColor,
          borderColor: primaryColor,
          "&:hover": { backgroundColor: "#f7ebfb", borderColor: primaryColor },
        },
      },
    },
  },
});

export default theme;
export { primaryColor, primaryHover, textColour };
