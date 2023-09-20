import { createTheme } from "@mui/material/styles";

const msTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "Capitalize",
        },
      },
    },
  },
});

export default msTheme;
