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

  const smallFormTheme = createTheme({
  palette: {
    primary: { main: primaryColor },
  },
  components: {
    MuiFormControl: {
      defaultProps: { margin: "dense" },
    },
    MuiTextField: {
      defaultProps: { margin: "dense", size: "small" },
    },
    MuiSelect: {
      defaultProps: { margin: "dense", size: "small" },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.75rem" },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: "0.75rem" },
      },
    },
  },
  typography: { fontSize: 12 },
});

export default theme;
export { primaryColor, primaryHover, textColour, smallFormTheme };

