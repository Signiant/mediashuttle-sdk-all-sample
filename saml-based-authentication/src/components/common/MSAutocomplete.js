import React from "react";
import noop from "lodash/noop";
import PropTypes from "prop-types";

import { Typography, Autocomplete, Box } from "@mui/material";

import T from "T";

import MSTextField from "./MSTextField";
import WithInputLabel from "./WithInputLabel";

const MSAutocomplete = ({
  label = "",
  listDetails = [],
  value = null,
  placeholder = T.SELECT_OPTION,
  required,
  endIcon,
  deprecatedLabel = true,
  getByLabelText = noop,
  onHandleChange = noop,
  ...rest
}) => {
  return (
    <Autocomplete
      options={listDetails}
      size="small"
      value={value}
      getOptionLabel={(option) => getByLabelText(option, label)}
      onChange={(event, newValue) => onHandleChange(event, newValue)}
      {...rest}
      sx={{
        "& .MuiTextField-root": {
          fontSize: 12,
          minWidth: 250,
        },
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Typography variant="subtitle2">
            {getByLabelText(option, label)}
          </Typography>
        </li>
      )}
      renderInput={(params) => (
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            "& .MuiInputLabel-root": {
              minWidth: 71,
              justifyContent: "end",
            },
          }}
        >
          <WithInputLabel
            label={deprecatedLabel && label}
            required={required}
            endIcon={endIcon}
          >
            <MSTextField
              variant="outlined"
              placeholder={placeholder}
              {...params}
            />
          </WithInputLabel>
        </Box>
      )}
    />
  );
};
MSAutocomplete.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  listDetails: PropTypes.array,
  value: PropTypes.object,
  getByLabelText: PropTypes.func,
  onHandleChange: PropTypes.func,
};
export default MSAutocomplete;
