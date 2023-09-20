import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

const MSLoader = ({ size = "30px" }) => (
  <CircularProgress disableShrink size={size} sx={{ mr: 2 }} />
);

export default MSLoader;
