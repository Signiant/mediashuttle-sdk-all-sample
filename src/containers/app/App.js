import React from "react";

import { ThemeProvider } from "@mui/material/styles";

import { HelmetProvider } from "react-helmet-async";

import MainContainer from "containers/MainContainer";
import { MediaShuttlePage } from "pages";

import msTheme from "theme";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={msTheme}>
        <MainContainer>
          <MediaShuttlePage />
        </MainContainer>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
