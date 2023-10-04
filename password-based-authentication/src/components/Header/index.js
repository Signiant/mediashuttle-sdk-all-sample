import React from "react";

import { AppBar, Box, Typography } from "@mui/material";

import T from "T";

const Header = () => {
  return (
    <Box display="block" mb={6}>
      <AppBar position="fixed" sx={{ p: 1.6 }}>
        <Typography variant="body1" textAlign="center">
          {T.FILE_BROWSER_AND_TRANSFER_MANAGER}
        </Typography>
      </AppBar>
    </Box>
  );
};

export default Header;
