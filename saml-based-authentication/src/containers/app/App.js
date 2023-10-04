import React from "react";

import { ThemeProvider } from "@mui/material/styles";

import { HelmetProvider } from "react-helmet-async";

import MainContainer from "containers/MainContainer";
import { MediaShuttlePage, AuthCallbackPage } from "pages";
import { Routes, Route } from 'react-router-dom';

import msTheme from "theme";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {
            <MainContainer>
                <MediaShuttlePage />
            </MainContainer>
        }
        />
        <Route path="authCallback" element= {
            <MainContainer>
                <AuthCallbackPage />
            </MainContainer>
        }/>
      </Routes>
    </div>
  );
}

export default App;
