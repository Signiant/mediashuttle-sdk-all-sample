import React from "react";
import PropTypes from "prop-types";

import TextField from "@mui/material/TextField";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import WithInputLabel from "./WithInputLabel";

const MSTextField = ({
  label,
  disabled,
  required,
  endIcon,
  variant = "outlined",
  autoComplete = "off",
  readOnly = false,
  InputProps = {},
  SelectProps = {},
  deprecatedLabel = true,
  multiline = false,
  rows = 6,
  ...rest
}) => {
  const helperText = rest?.helperText;
  return (
    <WithInputLabel
      label={deprecatedLabel && label}
      required={required}
      endIcon={endIcon}
    >
      <TextField
        disabled={disabled}
        InputProps={{ ...InputProps, readOnly }}
        variant={variant}
        multiline={multiline}
        autoComplete={autoComplete}
        required={required}
        rows={multiline ? rows : ""}
        label={deprecatedLabel ? null : label}
        {...rest}
        helperText={helperText}
        sx={{
          "& .MuiOutlinedInput-input": {
            fontSize: 12,
            minWidth: 220,
          },
          mr: 2.5,
          overflow: "hidden",
        }}
        SelectProps={{
          ...SelectProps,
          IconComponent: (props) => <KeyboardArrowDownRounded {...props} />,
          MenuProps: {
            elevation: 0,
            PaperProps: {
              sx: {
                boxShadow:
                  "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
                maxHeight: 200,
              },
              variant: "outlined",
            },
          },
        }}
      />
    </WithInputLabel>
  );
};

MSTextField.propTypes = {
  label: PropTypes.string,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
  endIcon: PropTypes.node,
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  SelectProps: PropTypes.object,
  InputProps: PropTypes.object,
  deprecatedLabel: PropTypes.bool,
};

export default MSTextField;
