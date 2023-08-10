import React from "react";
import { InputLabel, styled, Typography } from "@mui/material";
import PropTypes from "prop-types";

const HHInputLabel = styled(InputLabel)(({ theme }) => ({
  textAlign: "left",
  ...theme.typography.subtitle2,
  lineHeight: "24px",
  marginRight: 8,
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  overflow: 'inherit',
  "& .MuiFormLabel-asterisk": {
    color: "#aa2b2b",
  },
}));

const WithInputLabel = ({
  children,
  label = undefined,
  required = false,
  endIcon,
  disabled = false,
}) => {
  return (
    <>
      {label ? (
        <>
          <HHInputLabel
            required={required}
            shrink={false}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {label}
            </Typography>
            {endIcon}
          </HHInputLabel>
          {children}
        </>
      ) : (
        children
      )}
    </>
  );
};

WithInputLabel.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  required: PropTypes.bool,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
};

export default WithInputLabel;
