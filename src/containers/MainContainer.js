import React from "react";
import PropTypes from "prop-types";

import Header from "components/Header/index.js";
import T from "T";
import "react-toastify/dist/ReactToastify.css";

import { Helmet } from "react-helmet-async";
import { ToastContainer, Zoom } from "react-toastify";
import { Box, Typography } from "@mui/material";

const MainContainer = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>{T.FILE_BROWSER_AND_TRANSFER_MANAGER}</title>
      </Helmet>

      {<Header />}

      {children}

      <ToastContainer
        position="top-right"
        autoClose={T.TOAST_DISMISS_TIMEOUT}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        transition={Zoom}
        theme="colored"
      />

      <Box
        position="fixed"
        bottom={0}
        p={1}
        right={0}
        left="auto"
        width="100%"
        bgcolor="#FFF"
        textAlign="end"
      >
        <Typography variant="body2" fontWeight={500} display="initial">
          {T.POWERED_BY}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={700}
          color="primary"
          display="initial"
        >
          {T.MEDIA_SHUTTLE_SDK}
        </Typography>
      </Box>
    </>
  );
};

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContainer;
