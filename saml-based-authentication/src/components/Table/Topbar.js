import React, { Children } from "react";
import noop from "lodash/noop";
import PropTypes from "prop-types";

import { Breadcrumbs, Typography, Button } from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import T from "T";

const Topbar = ({
  breadCrumbsElements = [],
  canUpload = false,
  getHomeRecords = noop,
  handleBreadCrumbClick = noop,
  handleClick = noop,
  handleUpload = noop,
}) => {
  return (
    <>
      <Breadcrumbs maxItems={12} aria-label="breadcrumb" sx={{ mb: 0.5 }}>
        <Typography
          fontSize={14}
          fontWeight={600}
          color={breadCrumbsElements.length === 0 ? "primary" : ""}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignContent: "center",
          }}
          onClick={getHomeRecords}
        >
          <HomeOutlinedIcon fontSize="small" sx={{ mr: 0.4 }} />
          {T.HOME}
        </Typography>

        {breadCrumbsElements.length > 0 &&
          Children.toArray(
            breadCrumbsElements.map((element, index) => {
              return (
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  color={
                    breadCrumbsElements.length === index + 1 ? "primary" : ""
                  }
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleBreadCrumbClick(element)}
                >
                  {element}
                </Typography>
              );
            })
          )}
      </Breadcrumbs>

      <Button
        variant="outlined"
        size="small"
        sx={{ mb: 1, minWidth: 150, alignContent: "center" }}
        onClick={() => handleClick()}
      >
        <RefreshOutlinedIcon fontSize="small" sx={{ mr: 0.4 }} />
        {T.REFRESH}
      </Button>

      {breadCrumbsElements.length > 0 && (
        <Button
          variant="outlined"
          size="small"
          sx={{ ml: 1, mb: 1, minWidth: 150, alignContent: "center" }}
          onClick={() => handleClick("pop")}
        >
          <ArrowUpwardOutlinedIcon fontSize="small" sx={{ mr: 0.4 }} />
          {T.UP}
        </Button>
      )}

      {canUpload && (
        <Button
          variant="outlined"
          size="small"
          sx={{
            ml: 1,
            mb: 1,
            minWidth: 150,
            alignContent: "center",
          }}
          onClick={handleUpload}
        >
          <UploadOutlinedIcon fontSize="small" sx={{ mr: 0.4 }} />
          {T.UPLOAD}
        </Button>
      )}
    </>
  );
};

Topbar.propTypes = {
  breadCrumbsElements: PropTypes.array,
  canUpload: PropTypes.bool,
  getHomeRecords: PropTypes.func,
  handleBreadCrumbClick: PropTypes.func,
  handleClick: PropTypes.func,
  handleUpload: PropTypes.func,
};

export default Topbar;
